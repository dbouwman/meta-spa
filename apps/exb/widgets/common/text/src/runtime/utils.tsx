export const isDescendant = (node, ancestor) => {
    if (document.contains) {
        return ancestor.contains(node);
    }
    try {
        while (node) {
            if (node == ancestor) {
                return true; // Boolean
            }
            node = node.parentNode;
        }
    } catch (e) { /* squelch, return false */ }
    return false;
};