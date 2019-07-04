class KaHarmony {
    constructor(name, neutral, opposite) {
        this.name = name;
        this.neutral = neutral;
        this.opposite = opposite;
    }
    getName() {
        return this.name;
    }

    getNeutrals() {
        return this.neutral;
    }

    getOpposites() {
        return this.opposite;
    }

    isNeutral(element) {
        return this.neutral.includes(element)
    }
}

class KaElement {
    constructor(name, ratio, bonusMatrix) {
        this.name = name;
        this.ratio = ratio;
        this.bonusMatrix = bonusMatrix;
    }

    getName() {
        return this.name;
    }

    getKaValue() {
        return Math.ceil(totalKa/this.ratio);
    }

    getBonus() {
        const bonus = this.bonusMatrix.filter((el) => {
            return this.getKaValue() <= el.max && this.getKaValue() >= el.min
        });
        return bonus[0].value
    }
}

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

const harmonyMatrix = {
    'fire': new KaHarmony('fire', ['air', 'earth'], ['water', 'moon']),
    'air': new KaHarmony('air', ['fire', 'eau'], ['water', 'earth']),
    'water': new KaHarmony('water', ['air', 'moon'], ['fire', 'earth']),
    'moon': new KaHarmony('moon', ['water', 'earth'], ['fire', 'air']),
    'earth': new KaHarmony('earth', ['moon', 'fire'], ['water', 'air'])
};
const kaHarmony = [];
let totalKa = 0;
const ratios = [1, 1.25, 1.666666667, 2.5, 5];

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
const debounce = (func, wait, immediate) => {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

const hasFilledNeutral = () => { return kaHarmony.length == 3; }
const hasFilledOpposite = () => { return kaHarmony.length == 5; }


const buildElement = (ratio, element) => {
    return new KaElement(element, ratio, bonusMatrix);
}

const sortElements = () => {
    totalKa = document.querySelector('#ka-input').value;
    kaHarmony.map((el) => {
        const elementCard = document.querySelector(`#card-container .${el.getName()}-card`);
        elementCard.querySelector('.bonus span').innerHTML = el.getBonus();
        elementCard.querySelector('.roll span').innerHTML = `${el.getKaValue() * 2}%`;
        elementCard.querySelector('.pentacle span').innerHTML = el.getKaValue();
    })
};

$('#sort-ka .ka-element').draggable({ revert: "invalid" });

$('#droppable .dominant').droppable({
    accept: "#sort-ka .ka-element",
    drop: (event, ui) => {
        const draggedElement = ui.draggable[0];
        const element = draggedElement.dataset.element;
        const droppedHarmony = event.target;
        const ratio = droppedHarmony.dataset.ratio;
        kaHarmony.push(buildElement(ratio, element));
        droppedHarmony.classList.add('d-none');
        draggedElement.classList.add('d-none');
        sortElements();
        Array.from(document.querySelectorAll('#droppable .neutral'))
            .map((el) => {
                el.classList.toggle('d-none');
            });
        const harmony = harmonyMatrix[element];
        const oppositesElement = harmony.getOpposites();
        oppositesElement.map((el) => {
            const elementCard = document.querySelector(`#sort-ka .${el}`);
            elementCard.classList.add('d-none', 'opposite');
        });
    },
});

$('#droppable .neutral').droppable({
    accept: "#sort-ka .ka-element",
    drop: (event, ui) => {
        const element = ui.draggable[0].dataset.element;
        const ratio = event.target.dataset.ratio;
        kaHarmony.push(buildElement(ratio, element));
        event.target.classList.add('d-none');
        ui.draggable[0].classList.add('d-none');

        if (!hasFilledNeutral()) {
            return;
        }
        sortElements();

        Array.from(document.querySelectorAll('#droppable .opposite'))
            .map((el) => {
                el.classList.toggle('d-none');
            });
        Array.from(document.querySelectorAll('#sort-ka .opposite'))
            .map((el) => {
                el.classList.toggle('d-none');
            });
    },
});

$('#droppable .opposite').droppable({
    accept: "#sort-ka .ka-element",
    drop: (event, ui) => {
        const element = ui.draggable[0].dataset.element;
        const ratio = event.target.dataset.ratio;
        kaHarmony.push(buildElement(ratio, element));
        event.target.classList.add('d-none');
        ui.draggable[0].classList.add('d-none');
        if (!hasFilledOpposite()) {
            return;
        }
        document.querySelector('#sort-ka').classList.add('d-none');
        sortElements();
    }
}); 

document.querySelector('#ka-input').addEventListener('change', (event) => {
    debounce(sortElements(), 500);
    event.preventDefault();
});
totalKa = document.querySelector('#ka-input').value;