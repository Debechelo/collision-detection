import Circle from './circle'

describe('Circle.contains()', () => {
    let circle
    beforeEach(() => {
        circle = new Circle(3, 3, 3)
    })

    it('should returns true if point is inside the circle', () => {
        expect(circle.contains({x: 2, y: 2})).toBeTruthy()
    })

    it('should returns true if point located on circle left or top border', () => {
        expect(circle.contains({x: 3, y: 0})).toBeTruthy()
        expect(circle.contains({x: 0, y: 3})).toBeTruthy()
    })

    it('should returns true if point located on circle right or bottom border', () => {
        expect(circle.contains({x: 3, y: 6})).toBeTruthy()
        expect(circle.contains({x: 6, y: 3})).toBeTruthy()
    })

    it('should returns false if point is out of circle', () => {
        expect(circle.contains({x: 6, y: 6})).toBeFalsy()

    })
})

describe('circleangle.intersects()', () => {
    let circle
    beforeEach(() => {
        circle = new Circle(3, 3, 3)
    })

    it('should returns true if circle are intersected', () => {
        const othercircle = new Circle(1, 1, 3)
        expect(circle.intersects(othercircle)).toBeTruthy()

        //    0    1    2    3    4
        // 0  ┼──────────────○──────
        //    │              │
        // 1  │   ○───────────────○
        //    │   │◽◽◽◽◽◽◽◽◽◽│
        // 2  ┼──────────────○    │
        //    │   │               │
        // 3  │   ○───────────────○
    })

    it('should returns true if one circle contains other', () => {
        const othercircle = new Circle(3, 3, 2)
        expect(circle.intersects(othercircle)).toBeTruthy()

        //    0    1    2    3    4
        // 0  ┼────○────○────○──────
        //    │    │◽◽◽◽│    │
        // 1  │    │◽◽◽◽│    │
        //    │    │◽◽◽◽│    │
        // 2  ┼────○────○────○
        //    │
    })

    it('should returns false if circle are not intersected', () => {
        const othercircle = new Circle(8, 8, 1)
        expect(circle.intersects(othercircle)).toBeFalsy()
    })

    it('should returns true if circle equal another circle', () => {
        const othercircle = new Circle(3, 3, 3)
        expect(circle.equal(othercircle)).toBeTruthy()
    })
})