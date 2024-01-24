class PhotoDAW {

    constructor(id) {
        const divName = document.getElementById(id);
        const body = document.querySelector('body');
        this.option = "Linea";
        this.strokeStyle = "#000000";
        this.lineWidth = 2;
        this.createElement('canvas', 'canvas', body);
        this.canvas = document.querySelector('canvas');
        this.canvas.width = 500;
        this.canvas.height = 250;
        this.context = this.canvas.getContext('2d');
        this.x = 0;
        this.y = 0;
        this.clientX = 0;
        this.clientY = 0;
        this.event = undefined;
        this.isClick = false;
        this.createElement('p', 'p1', body);
        this.createElement('div', 'buttons', body);
        this.buttons = document.querySelector('.buttons');
        this.createElement('button', 'btn', this.buttons, 'Punts');
        this.createElement('button', 'btn', this.buttons, 'Rectangle');
        this.createElement('button', 'btn', this.buttons, 'Linea');
        this.createElement('button', 'btn', this.buttons, 'Cercle');
        this.createElement('button', 'btn', this.buttons, 'Netejar');
        this.createElement('input', 'input', this.buttons, '', 'color', 'idPicker');
        this.createElement('span', 'text', this.buttons, ' Gruix: ', '');
        this.createElement('input', 'input', this.buttons, '', 'range', 'idRange');
        this.createElement('div', 'radious', body);
        this.createElement('p', 'p2', document.querySelector('.radious'));
        this.createElement('p', 'p3', document.querySelector('.radious'));
        this.createElement('select', 'selects', document.querySelector('.radious'));
        this.createElement('option', 'option1', document.querySelector('select'));
        this.createElement('option', 'option2', document.querySelector('select'));
        this.createElement('option', 'option3', document.querySelector('select'));
        this.changeText();
        this.setValues();
        this.listeners();
        this.elements = [];
        this.point = false;
        this.pointValue = 10;
    }

    changeText() {
        const p = document.querySelectorAll('p');
        p[0].innerHTML = `OnClick: ${this.option}`;
        p[1].innerHTML = "Opcions punt";
        p[2].innerHTML = "Radi punt";
    }

    setValues () {
        const value = 10;
        
        document.querySelectorAll('option').forEach((elem, index) => {
            const actualValue = (value * (index + 1));
            elem.innerHTML = actualValue;
            elem.value = actualValue;
        });
    }

    createElement(element, classElement, elementParent, textElement = "", elementType = "", elementId = "") {
        const tempElement = document.createElement(element);
        tempElement.classList = classElement;
        tempElement.innerHTML = textElement;

        if (element === 'input') {
            tempElement.type = elementType;
            tempElement.id = elementId;
        }

        elementParent.appendChild(tempElement);
    }

    listeners() {
        const btns = document.querySelectorAll('button');
        const colorPicker = document.getElementById('idPicker');
        const thicknessInput = document.getElementById('idRange');
        const select = document.querySelector('select');

        select.addEventListener('change', () => {
            this.pointValue = Number(select.value);
        });

        colorPicker.addEventListener('input', (e) => {
            this.strokeStyle = e.target.value;
        });

        thicknessInput.addEventListener('input', (e) => {
            this.lineWidth = e.target.value;
        });

        btns.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                this.option = btn.textContent;
                this.changeText();

                if (this.option.toLowerCase() == "netejar") {
                    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    this.elements = [];
                }

                document.querySelector('.radious').style.display = this.option.toLowerCase() == "punts" ? "flex" : "none"; 

                if(this.option.toLowerCase() == "punts")

                btns.forEach((tempBtn, tempIndex) => {
                    tempBtn.classList = index == tempIndex ? 'btn' : 'btn';
                });
            });
        });

        this.canvas.addEventListener('mousedown', (e) => {
            this.isClick = true;

            this.x = e.x;
            this.y = e.y;

            if (this.option.toLowerCase() == 'punts') this.drawPoint(this.pointValue, this.strokeStyle, this.x, this.y);
        });

        this.canvas.addEventListener('mouseup', () => {
            this.isClick = false;

            this.elements.push({
                type: this.option,
                startX: this.x,
                startY: this.y,
                clientX: this.clientX,
                clientY: this.clientY,
                event: this.event,
                color: this.strokeStyle,
                lineWidth: this.lineWidth,
                pointValue: this.pointValue
            });

            this.redraw();
        });

        this.canvas.addEventListener('mousemove', (e) => {
            this.clientX = e.clientX;
            this.clientY = e.clientY;

            if (this.option.toLowerCase() == 'linea' && this.isClick) this.drawLine(this.strokeStyle, this.x, this.y, e, false, true);
            if (this.option.toLowerCase() == 'rectangle' && this.isClick) this.drawRect(this.strokeStyle, this.x, this.y, e.clientX, e.clientY, false, true);
            if (this.option.toLowerCase() == 'cercle' && this.isClick) this.drawCircle(this.strokeStyle, this.x, this.y, e.clientX, e.clientY, false, true);
        });
    }

    drawLine(color, startX, startY, event, background, repeat) {
        const canvasRect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - canvasRect.left;
        const mouseY = event.clientY - canvasRect.top;

        this.context.beginPath();
        if (repeat) this.redraw();
        this.context.moveTo(startX, startY);
        this.context.setLineDash(background ? [0, 0] : [3, 8]);
        this.context.strokeStyle = color;
        this.context.lineWidth = this.lineWidth;
        this.context.lineTo(mouseX, mouseY);
        this.context.stroke();

        this.event = event;
    }

    drawRect(color, startX, startY, endX, endY, background, repeat) {
        const canvasRect = this.canvas.getBoundingClientRect();
        const adjustedStartX = startX - canvasRect.left;
        const adjustedStartY = startY - canvasRect.top;
        const adjustedEndX = endX - canvasRect.left;
        const adjustedEndY = endY - canvasRect.top;

        this.context.lineWidth = this.lineWidth;

        this.context.beginPath();
        if (repeat) this.redraw();
        this.context.setLineDash(background ? [0, 0] : [3, 8]);
        this.context.strokeStyle = color;
        if (background) this.context.fillStyle = color;
        this.context.rect(adjustedStartX, adjustedStartY, (adjustedEndX - adjustedStartX), (adjustedEndY - adjustedStartY));

        if (!background) this.context.stroke();
        else this.context.fill();
    }

    drawPoint(w, color, startX, startY) {
        const canvasRect = this.canvas.getBoundingClientRect();
        const adjustedStartX = startX - canvasRect.left;
        const adjustedStartY = startY - canvasRect.top;

        this.context.beginPath();
        this.context.arc(adjustedStartX, adjustedStartY, w, 0, Math.PI * 2);
        this.context.setLineDash([0, 0]);
        this.context.fillStyle = color;
        this.context.fill();
    }

    drawCircle(color, startX, startY, endX, endY, background, repeat) {
        this.context.beginPath();
        const canvasRect = this.canvas.getBoundingClientRect();

        this.context.setLineDash(background ? [0, 0] : [3, 8]);

        const adjustedStartX = startX - canvasRect.left;
        const adjustedStartY = startY - canvasRect.top;
        const adjustedEndX = endX - canvasRect.left;
        const adjustedEndY = endY - canvasRect.top;

        const radius = Math.sqrt(Math.pow(adjustedEndX - adjustedStartX, 2) + Math.pow(adjustedEndY - adjustedStartY, 2));

        this.context.strokeStyle = color;
        this.context.fillStyle = color;

        if (repeat) this.redraw();

        this.context.beginPath();
        this.context.setLineDash(background ? [0, 0] : [3, 8]);
        this.context.arc(adjustedStartX, adjustedStartY, radius, 0, Math.PI * 2);

        this.context.stroke();
    }


    redraw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.elements.forEach((elem) => {
            if (elem.type.toLowerCase() == 'rectangle') {
                this.drawRect(elem.color, elem.startX, elem.startY, elem.clientX, elem.clientY, true, false);
            } else if (elem.type.toLowerCase() == 'linea') {
                this.drawLine(elem.color, elem.startX, elem.startY, elem.event, true, false);
            } else if (elem.type.toLowerCase() == 'cercle') {
                this.drawCircle(elem.color, elem.startX, elem.startY, elem.clientX, elem.clientY, true, false);
            } else if (elem.type.toLowerCase() == 'punts') {
                this.drawPoint(elem.pointValue, elem.color, elem.startX, elem.startY);
            }
        });
    }


}
