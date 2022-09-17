export default class Triangle {
    constructor(x, y, side) {
        this.x = x
        this.y = y
        this.side = side
        this.speed = {x: 0, y: 0}
        this.hits = 0
        this.countVertexes = 3
        this.vertexes = {}
        this.hit = false
        this.findVertexes()
    }

    findVertexes(){    
        this.vertexes.x = []
        this.vertexes.y = []
        for (let i = 0; i < this.countVertexes; i++) {
            this.vertexes.x.push(this.x - this.side * Math.sin(i * 2 * Math.PI / 3))
            this.vertexes.y.push(this.y - this.side * Math.cos(i * 2 * Math.PI / 3))
        }
    }

    setSpeed(x, y){
        this.speed.x = x
        this.speed.y = y
    }

    contains(point) {
        return ((point.x-this.x)*(point.x-this.x)+(point.y-this.y)*(point.y-this.y) <= this.side*this.side)
    }

    intersects(figure)
        {
            const axis ={}

            for (let j = this.countVertexes-1, i = 0; i < this.countVertexes; j=i,i++)
            {
                axis.x = this.vertexes.y[j] - this.vertexes.y[i];
                axis.y = this.vertexes.x[i] - this.vertexes.x[j];
                if (!IntervalIntersect(this, figure, axis))
                    return false;
            }
            // if(figure.constructor.name != "Circle1")
            // for (let j = figure.countVertexes-1, i = 0; i < figure.countVertexes; j = i, i++)
            // {
            //     axis.x = figure.vertexes.y[j] - figure.vertexes.y[i];
            //     axis.y = figure.vertexes.x[i] - figure.vertexes.x[j];
            //     if (!IntervalIntersect(figure, this, axis))
            //         return false;
            // }
            return true;


    function IntervalIntersect(a, b, axis)
        {
            let projection1 = GetInterval(a, axis);
            let projection2 = GetInterval(b, axis);
            let d0 = projection1.min - projection2.max; 
            let d1 = projection2.min - projection1.max;

            if (d0 > 0|| d1 > 0)
                return false;
            else return true;
        }

    function GetInterval(figure, axis)
        {
            const projection = {}
            if(figure.constructor.name == "Circle1"){
                let y1,x1,y2,x2
                if(axis.y!=0) {   
                y1 = (figure.r*axis.y)/(Math.sqrt(axis.x*axis.x+axis.y*axis.y))+figure.y
                y2 = -(figure.r*axis.y)/(Math.sqrt(axis.x*axis.x+axis.y*axis.y))+figure.y
                x1 = axis.x*(y1-figure.y)/axis.y+figure.x
                x2 = axis.x*(y2-figure.y)/axis.y+figure.x
                } else {
                    x1 = (figure.r*axis.x)/(Math.sqrt(axis.x*axis.x+axis.y*axis.y))+figure.x
                    x2 = -(figure.r*axis.x)/(Math.sqrt(axis.x*axis.x+axis.y*axis.y))+figure.x
                    y1 = axis.y*(x1-figure.x)/axis.x+figure.y
                    y2 = axis.y*(x2-figure.x)/axis.x+figure.y
                }
                projection.min = x1*axis.x + y1*axis.y
                projection.max = x2*axis.x + y2*axis.y
                if(projection.min>projection.max){
                    projection.min = projection.min - projection.max
                    projection.max = projection.max + projection.min
                    projection.min = projection.max - projection.min
                }
                return projection
            }
            projection.min = projection.max = figure.vertexes.x[0]*axis.x + figure.vertexes.y[0]*axis.y
            for (let i = 1; i < figure.vertexes.x.length; i++)
            {
                let dot = figure.vertexes.x[i]*axis.x + figure.vertexes.y[i]*axis.y
                if (dot < projection.min)
                    projection.min = dot;
                else if (dot > projection.max)
                    projection.max = dot;
            }
            return projection
        }
    }

    equal(circle) {
        return (this.x == circle.x
            && this.y == circle.y
            && this.side == circle.side)
    }
}