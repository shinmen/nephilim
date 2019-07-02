$("input[type='number']").inputSpinner();

const bonusMatrix = [
    {"min": 1, "max": 4, "value": 1},
    {"min": 5, "max": 8, "value": 2},
    {"min": 9, "max": 12, "value": 3},
    {"min": 13, "max": 16, "value": 4},
    {"min": 17, "max": 20, "value": 5},
    {"min": 21, "max": 24, "value": 6},
    {"min": 25, "max": 28, "value": 7},
    {"min": 29, "max": 39, "value": 8},
    {"min": 40, "max": 59, "value": 9},
    {"min": 60, "max": 69, "value": 10},
    {"min": 70, "max": 79, "value": 11},
    {"min": 80, "max": 100, "value": 12},
];

const ratios = [1, 1.25, 1.666666667, 2.5, 5];

class KaElement {
    constructor(name, ratio, totalKa, bonusMatrix) {
        this.name = name;
        this.ratio = ratio;
        this.totalKa = totalKa;
        this.bonusMatrix = bonusMatrix;
    }

    getName() {
        return this.name;
    }

    getKaValue() {
        return Math.ceil(this.totalKa/this.ratio);
    }

    getBonus() {
        const bonus = this.bonusMatrix.filter((el) => {
            getKaValue() <= el.max && getKaValue() >= el.min
        })
        return bonus.value
    }
}

const buildElements = (ratio, element) => {
    const totalKa = document.querySelector('#ka-input');
    return new KaElement(element, ratio, totalKa.value, bonusMatrix);
}

const sortElements = () => {
    const totalKa = document.querySelector('#ka-input');
    const kas = Array.from(document.querySelectorAll('#sort-ka .ka-element'));
    const sorted = kas.map((el, i) => {
        const ratio = ratios[i];
        return buildElements(ratio, el.dataset.element);
    });
    sorted.map((el) => {
        const elementCard = document.querySelector(`#card-container .${el.getKaValue()}`);
    })
}

$('#sort-ka').sortable().bind('sortupdate', function(e, ui) {
    sortElements();
});

sortElements();


