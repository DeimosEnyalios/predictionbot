import { calcMode } from "../logic";

describe('calcMode', function() {
    it('1,1,2,3,4', function() {
        let result = calcMode(...[1,1,2,3,4]);
        expect(result).toBe(1);
    });
});

describe('calcMode', function() {
    it('1,2,2,3,4', function() {
        let result = calcMode(...[1,2,2,3,4]);
        expect(result).toBe(2);
    });
});


describe('calcMode', function() {
    it('1,1,2,2,3,4', function() {
        let result = calcMode(...[1,1,2,2,3,4]);
        expect(result).toBe(2);
    });
});