import helpers from './helpers';

class DragController {
    /**
     * created initial data for vue component
     * @param {string} dragType - can be horisontal and vertical
     * @returns obj initial data
     *
     * for using vue component need have $refs
     */
    getInitialData(dragType) {
        return {
            dragpos: {
                x: 0,
                y: 0
            },
            dragType,
            newOrder: -1,
            draggedItem: null,
        }
    }

    _getNewStepsOrder(elements, cords) {
        const currentElem = this.$refs.dragItemsList.find(elem =>
            {
                console.log(elem.getAttribute('data-id'), this.draggedItem.ID);
            return +elem.getAttribute('data-id') === this.draggedItem.ID
    }
        );
        console.log(currentElem);
        let currentOrder = this.draggedItem.order;
        let newOrder = currentOrder;
        const currentElemStart = helpers.getOffsetRect(currentElem).top;
        const currentElemEnd = currentElemStart + currentElem.offsetHeight;
        const scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
        const finalCursorPos = scrollTop + cords.y;

        if (finalCursorPos < currentElemStart) {
            newOrder = currentOrder - 1;
        } else if (finalCursorPos > currentElemEnd) {
            newOrder = currentOrder + 2;
        }

        if (newOrder < 0 ) {
            newOrder = 0;
        }else if(newOrder > elements.length){
            newOrder = elements.length
        }

        return newOrder;
    }

    _getNewOrder(elements, cords) {
        if ('steps' === this.dragType) {
            return this._getNewStepsOrder(elements, cords);
        }

        let newPos = 0;
        let lastElementIndex;
        let offsetsList = elements.map((elem, index) => {
            return {
                index,
                elem,
                offsetY: helpers.getOffsetRect(elem).top + elem.offsetHeight / 2,
                // offsetY: helpers.getOffsetRect(elem).top,
                offsetX: helpers.getOffsetRect(elem).left + elem.offsetWidth / 2
                // offsetX: helpers.getOffsetRect(elem).left
            }
        });

        offsetsList.unshift({offsetY: -10000, offsetX: -10000});
        lastElementIndex = offsetsList.length - 1;

        if ('horizontal' === this.dragType) {
            offsetsList.sort((a, b) => a.offsetX - b.offsetX);
            if (cords.x > offsetsList[lastElementIndex].offsetX) {
                return lastElementIndex;
            }

            for (let i = offsetsList.length - 1; i > 0; i--) {
                if (cords.x > offsetsList[i].offsetX
                    && cords.x > offsetsList[i - 1].offsetX) {
                    newPos = i;
                    break
                }
            }

        } else {

            offsetsList.sort((a, b) => a.offsetY - b.offsetY);

            let scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
            let finalCursorPos = scrollTop + cords.y;

            if (finalCursorPos > offsetsList[lastElementIndex].offsetY) {
                return lastElementIndex;
            }

            for (let i = offsetsList.length - 1; i > 0; i--) {
                if (finalCursorPos > offsetsList[i].offsetY
                    && finalCursorPos > offsetsList[i - 1].offsetY) {
                    newPos = i;
                    break
                }
            }
        }
        // console.log(newPos);
        return newPos;
    }

    /**
     *
     * Return methods which will be used like vue components methods
     */
    getDragMethods() {
        return {
            dragstart: this.dragstart,
            _dragmove: this._dragmove,
            _dragend: this._dragend,
            _dragHandler: this._dragHandler,
            _getNewOrder: this._getNewOrder,
            _getNewStepsOrder: this._getNewStepsOrder
        }
    }

    /**
     * Handler for mousedown - need add manually
     * add class drag-in-progress to body
     * add handlers to body on mousemove and mouseup events
     * @param e - event
     *
     */
    dragstart(e, item) {
        this.draggedItem = item;
        this._dragHandler(e);

        document.addEventListener('mousemove', this._dragmove);
        document.addEventListener('mouseup', this._dragend);
        document.body.classList.add('drag-in-progress');
    }

    /**
     * Handler for mousemove, used automatically
     * @param e - event
     */
    _dragmove(e) {
        if (this._dragHandler(e) && this.dragmoveCallback) {
            this.dragmoveCallback();
        }
    }

    /**
     * Handler for mouseup, used automatically
     * remove class drag-in-progress from body
     * call method _dragendCallback from vue component
     * @param e - event
     */
    _dragend(e) {
        this._dragHandler(e);
        if (this.dragendCallback) {
            this.dragendCallback();
        }
        this.newOrder = -1;
        this.draggedItem = null;
        document.removeEventListener('mousemove', this._dragmove);
        document.removeEventListener('mouseup', this._dragend);
        document.body.classList.remove('drag-in-progress');
    }

    _dragHandler(e) {
        helpers.pauseEvent(e);
        if (Math.abs(this.dragpos.x - e.clientX) > 20 || Math.abs(this.dragpos.y - e.clientY) > 20) {
            let oldOrder = this.newOrder;
            this.dragpos.x = e.clientX;
            this.dragpos.y = e.clientY;
            this.newOrder = this._getNewOrder(this.$refs.dragItemsList, this.dragpos);
            if (this.newOrder !== oldOrder) {
                return true;
            }
        }
    }
}

const dragController = new DragController();

export default dragController;