
class PhotoDAW {

    constructor(id) {
        const divName = document.getElementById(id);
        const body = document.querySelector('body');

        this.option = "Linia";

        this.createElement('canvas', 'canvas', body);

        this.canvas = document.querySelector('canvas');
        this.canvas.width = 500;
        this.canvas.height = 250;
        this.context = this.canvas.getContext('2d');

        this.x = 0;
        this.y = 0;
        this.event = undefined;
        this.radious = 20;
        this.isClick = false;

        this.createElement('p', 'canvas', body);
        
        this.changeText();

        this.createElement('div', 'buttons', body);

        this.buttons = document.querySelector('.buttons');

        this.createElement('button', 'btn', this.buttons, 'Punts');
        this.createElement('button', 'btn', this.buttons, 'Rectangle');
        this.createElement('button', 'btn active', this.buttons, 'Linea');
        this.createElement('button', 'btn', this.buttons, 'Cercle');
        this.createElement('button', 'btn', this.buttons, 'Netejar');
        this.createElement('input', 'input', this.buttons, '', 'color');
        this.createElement('span', 'text', this.buttons, ' Gruix: ', '');
        this.createElement('input', 'input', this.buttons, '', 'range');

        this.listeners();

        this.elements = [];
    }

    changeText() {
        let text = document.querySelector('p');
        text.innerHTML = `OnClick: ${this.option}`;
    }

    createElement(element, classElement, elementParent, textElement = "", elementType = ""){

        const tempElement = document.createElement(element);
        tempElement.classList = classElement;
        tempElement.innerHTML = textElement;

        if(element = 'input'){
            tempElement.type = elementType;
        }

        elementParent.appendChild(tempElement);

    }

    listeners(){
        const btns = document.querySelectorAll('button');

        btns.forEach((btn, index) => {

            btn.addEventListener('click', () => {
                this.option = btn.textContent;
                this.changeText();

                btns.forEach((tempBtn, tempIndex) => {
                    tempBtn.classList = index == tempIndex ? 'btn active' : 'btn';
                });
            }); 
        });

        this.canvas.addEventListener('mousedown', (e) => {

            this.isClick = true;

            this.x = e.x;
            this.y = e.y;

            if(this.option.toLowerCase() == 'punts') this.drawPoint();

        });

        this.canvas.addEventListener('mouseup', () => {
            this.isClick = false;

            this.elements.push({
                type: this.option,
                startX: this.x,
                startY: this.y,
                event: this.event
            });

            this.redraw();
        });

        this.canvas.addEventListener('mousemove', (e) => {

            if(this.option.toLowerCase() == 'linea' && this.isClick) this.drawLine(this.x, this.y, e, false);
            if(this.option.toLowerCase() == 'rectangle' && this.isClick) this.drawRect(this.x, this.y, e, false);
            if(this.option.toLowerCase() == 'cercle' && this.isClick) this.drawCircle(this.x, this.y, e);
        });

    }

    drawLine(startX, startY, event, background) {
        const canvasRect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - canvasRect.left;
        const mouseY = event.clientY - canvasRect.top;
    
        this.context.beginPath();
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.moveTo(startX, startY);
        this.context.setLineDash(background ? [0, 0] :  [3, 8]);
        this.context.lineTo(mouseX, mouseY);
        this.context.stroke();

        this.event = event;
    }

    drawRect(startX, startY, event, background) {
        const canvasRect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - canvasRect.left;
        const mouseY = event.clientY - canvasRect.top;
    
        this.context.beginPath();
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.setLineDash(background ? [0, 0] : [3, 8]);
        if(background) this.context.strokeStyle = "#000000";
        this.context.rect(startX, startY, (mouseX - this.x), (mouseY - this.y));
        
        if(!background)this.context.stroke();
        else this.context.fill();
        this.event = event;
    }

    drawPoint(){
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radious, 0, Math.PI * 2);
        this.context.setLineDash([0, 0]);
        this.context.fillStyle = "#000";
        this.context.fill();
    }

    drawCircle(startX, startY, event) {
        const canvasRect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - canvasRect.left;
        const mouseY = event.clientY - canvasRect.top;
    
        const radius = Math.sqrt(Math.pow(mouseX - this.x, 2) + Math.pow(mouseY - this.y, 2));
    
        this.context.beginPath();
        this.context.setLineDash([3, 8]);
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.arc(startX, startY, radius, 0, 2 * Math.PI);
        this.context.stroke();

        this.event = event;
    }

    redraw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.elements.forEach((elem) => {
            if(elem.type.toLowerCase() == 'rectangle') this.drawRect(elem.startX, elem.startY, elem.event, true)
            if(elem.type.toLowerCase() == 'linea') this.drawLine(elem.startX, elem.startY, elem.event, true)
        });
    }

}
