import Rectangle from './rectangle'

export default class QuadTree {
    constructor(boundary, capacity = 4) {
        this.figures = []
        this.boundary = boundary
        this.capacity = capacity
        this.hasChildren = false
        this.children = []
    }

    insert(figure) {
        if (!this.boundary.intersects(figure)) return
        if (!this.hasChildren) 
        if (this.figures.length < this.capacity) {
            this.figures.push(figure)
            return
        }
        if (!this.hasChildren) {
            this.subdivide()
            this.figures.forEach(fig => this.children.forEach(quad => quad.insert(fig)))
            this.figures = []
        }
        this.children.forEach(quad => quad.insert(figure))

    }

    get length() {
        let count = this.figures.length
        if (this.hasChildren) {
            // handle childrens somehow
        }
        return count
    }

    queryRange(rect, found = []) {
        const { boundary, figures, children } = this
        if (!rect.intersects(boundary)) {
            return found
        }
        found = found.concat(figures.filter(fig => rect.intersects(fig)))
        if (this.hasChildren) {
            children.forEach(ch => ch.queryRange(rect, found))
        }
        return found
    }

    subdivide() {
        const {x, y, w, h} = this.boundary
        const quadCoords = [
            {x1: x,y1: y},
            {x1: x+w/2,y1: y},
            {x1: x,y1: y+h/2},
            {x1: x+w/2,y1: y+h/2},]
        this.children = quadCoords.map(({x1, y1}) => new Rectangle(x1, y1, w/2, h/2))
            .map(rect => new QuadTree(rect, this.capacity))
        this.hasChildren = true
    }

    clear() {
        this.figures = []
        this.children = []
        this.hasChildren = false
    }
}
