var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from './BaseComponent.js';
import { autobind } from '../Decorators/Autobind.js';
import { validate } from '../Util/Validation.js';
import { projectState } from '../State/ProjectState.js';
export class ProjectInput extends Component {
    constructor() {
        super('project-input', 'app', true, 'user-input');
        this.titleInput = this.element.querySelector('#title');
        this.descriptionInput = this.element.querySelector('#description');
        this.peopleInput = this.element.querySelector('#people');
        this.configure();
    }
    gatherUserInput() {
        const enteredTitle = this.titleInput.value;
        const enteredDescription = this.descriptionInput.value;
        const enteredPeople = this.peopleInput.value;
        const resultTitleValidation = {
            value: enteredTitle,
            required: true,
            minLength: 3,
            maxLength: 12
        };
        const resultDescriptionValidation = {
            value: enteredDescription,
            minLength: 20,
            maxLength: 300
        };
        const resultPeopleValidation = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 10
        };
        if (!validate(resultTitleValidation) ||
            !validate(resultDescriptionValidation) ||
            !validate(resultPeopleValidation)) {
            return [enteredTitle, enteredDescription, +enteredPeople];
        }
        else {
            throw new Error('Please make sure all fields are filled in correctly.');
            return;
        }
    }
    clearInputs() {
        this.titleInput.value = '';
        this.descriptionInput.value = '';
        this.peopleInput.value = '';
    }
    submitHundler(e) {
        e.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput;
            projectState.addProject(title, desc, people);
            this.clearInputs();
        }
    }
    configure() {
        this.element.addEventListener('submit', this.submitHundler);
    }
    renderContent() { }
}
__decorate([
    autobind
], ProjectInput.prototype, "submitHundler", null);
//# sourceMappingURL=ProjectInput.js.map