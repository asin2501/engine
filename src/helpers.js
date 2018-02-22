export default {
    /**
     * method remove item from array, item - simple type, change array in place, returns nothing
     * @param array
     * @param item
     */
    removeItemFromArray(array, item){
        const index = array.indexOf(item);

        if (index > -1) {
            array.splice(index, 1);
        }
    },
    /**
     * return cross-browser offset element on page
     * @param elem
     * @returns {{top: number, left: number}}
     */
    getOffsetRect(elem) {
        let box = elem.getBoundingClientRect();
        let body = document.body;
        let docElem = document.documentElement;
        let scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
        let scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
        let clientTop = docElem.clientTop || body.clientTop || 0;
        let clientLeft = docElem.clientLeft || body.clientLeft || 0;
        let top = box.top + scrollTop - clientTop;
        let left = box.left + scrollLeft - clientLeft;

        return {top: Math.round(top), left: Math.round(left)}
    },
    /**
     * need for drag and drop - prevent text selection
     * @param e
     * @returns {boolean}
     */
    pauseEvent(e){
        if (e.stopPropagation) e.stopPropagation();
        if (e.preventDefault) e.preventDefault();
        e.cancelBubble = true;
        e.returnValue = false;
        return false;
    },
    /**
     * simply object copying
     * @param obj
     */
    copyObj(obj){
        return JSON.parse(JSON.stringify(obj));
    },
    /** all items in array must has order value, order start from 0
     * need for drag and drop sorting
     * @param reorderedItem - item, which change order
     * @param oldOrder
     * @param newOrder
     * @param list
     */
    changeOrder(reorderedItem, newOrder, list) {
        let oldOrder = reorderedItem.order;
        if (newOrder > oldOrder) {
            list.forEach(item => {
                if (item.order > oldOrder && item.order < newOrder) {
                    item.order--;
                }
            });
            reorderedItem.order = (newOrder - 1);
        } else {
            list.forEach(item => {
                if (item.order < oldOrder && item.order >= newOrder) {
                    item.order++;
                }
            });
            reorderedItem.order = newOrder;
        }
    }
}