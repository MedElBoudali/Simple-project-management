import { Component } from './BaseComponent.js';
import { autobind } from '../Decorators/Autobind.js';
import { validatable, validate } from '../Util/Validation.js';
import { projectState } from '../State/ProjectState.js';

// Project Input Class
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInput: HTMLInputElement;
  descriptionInput: HTMLInputElement;
  peopleInput: HTMLInputElement;

  constructor() {
    super('project-input', 'app', true, 'user-input');
    this.titleInput = this.element.querySelector('#title') as HTMLInputElement;
    this.descriptionInput = this.element.querySelector('#description') as HTMLInputElement;
    this.peopleInput = this.element.querySelector('#people') as HTMLInputElement;
    // replace the app element with this.element
    this.configure();
  }

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInput.value;
    const enteredDescription = this.descriptionInput.value;
    const enteredPeople = this.peopleInput.value;

    const resultTitleValidation: validatable = {
      value: enteredTitle,
      required: true,
      minLength: 3,
      maxLength: 12
    };
    const resultDescriptionValidation: validatable = {
      value: enteredDescription,
      minLength: 20,
      maxLength: 300
    };
    const resultPeopleValidation: validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 10
    };

    if (
      !validate(resultTitleValidation) ||
      !validate(resultDescriptionValidation) ||
      !validate(resultPeopleValidation)
    ) {
      return [enteredTitle, enteredDescription, +enteredPeople];
    } else {
      throw new Error('Please make sure all fields are filled in correctly.');
      return;
    }
  }

  private clearInputs() {
    this.titleInput.value = '';
    this.descriptionInput.value = '';
    this.peopleInput.value = '';
  }

  @autobind
  private submitHundler(e: Event) {
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
  renderContent() {}
}
