/// <reference path="./Interfaces/DragDrop.ts" />
/// <reference path="./Models/ProjectModel.ts" />
/// <reference path="./Models/ProjectState.ts" />
/// <reference path="./Models/Validation.ts" />
/// <reference path="./Decorators/Autobind.ts" />

namespace App {
  // Component Base Class
  abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    hostElement: T;
    element: U;
    constructor(
      templateId: string,
      hostElementId: string,
      insertAtStart: boolean,
      newElementId?: string
    ) {
      this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
      this.hostElement = document.getElementById(hostElementId)! as T;
      const importedHtmlContent = document.importNode(this.templateElement.content, true);
      this.element = importedHtmlContent.firstElementChild as U;
      newElementId && (this.element.id = newElementId);
      this.attach(insertAtStart);
    }
    private attach(insertAtStart: boolean) {
      this.hostElement.insertAdjacentElement(
        insertAtStart ? 'afterbegin' : 'beforeend',
        this.element
      );
    }
    abstract configure(): void;
    abstract renderContent(): void;
  }

  // Project Input Class
  class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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

  // Project Item Class
  class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
    private project: Project;
    get persons() {
      if (this.project.people === 1) {
        return '1 person';
      } else {
        return `${this.project.people} persons`;
      }
    }

    constructor(hostId: string, project: Project) {
      super('single-project', hostId, false, project.id);
      this.project = project;
      this.configure();
      this.renderContent();
    }

    @autobind
    dragStartHandler(event: DragEvent) {
      event.dataTransfer!.setData('text/plain', this.project.id);
      event.dataTransfer!.effectAllowed = 'move';
    }

    @autobind
    dragEndHandler(_: DragEvent) {
      // console.log('DragEnd');
    }

    configure() {
      this.element.addEventListener('dragstart', this.dragStartHandler);
      this.element.addEventListener('dragend', this.dragEndHandler);
    }

    renderContent() {
      this.element.querySelector('h2')!.textContent = this.project.title;
      this.element.querySelector('h3')!.textContent = this.persons + ' assigned.';
      this.element.querySelector('p')!.textContent = this.project.description;
    }
  }

  // Project List Class
  class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
    assignedProjects: Project[];

    constructor(private type: 'active' | 'finished') {
      super('project-list', 'app', false, `${type}-projects`);
      this.assignedProjects = [];
      this.configure();
      this.renderContent();
    }

    @autobind
    dragOverHandler(event: DragEvent) {
      if (event.dataTransfer && event.dataTransfer.types[0] == 'text/plain') {
        event.preventDefault();
        const listEl = this.element.querySelector('ul')! as HTMLUListElement;
        listEl.classList.add('droppable');
      }
    }
    @autobind
    dropHandler(event: DragEvent) {
      const prjId = event.dataTransfer!.getData('text/plain');
      projectState.moveProject(
        prjId,
        this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished
      );
    }
    @autobind
    dragLeaveHandler(_: DragEvent) {
      const listEl = this.element.querySelector('ul')! as HTMLUListElement;
      listEl.classList.remove('droppable');
    }

    configure() {
      this.element.addEventListener('dragover', this.dragOverHandler);
      this.element.addEventListener('drop', this.dropHandler);
      this.element.addEventListener('dragleave', this.dragLeaveHandler);

      projectState.addListeners((projects: Project[]) => {
        const relevantProjects = projects.filter(project => {
          if (this.type === 'active') {
            return project.status === ProjectStatus.Active;
          } else {
            return project.status === ProjectStatus.Finished;
          }
        });
        this.assignedProjects = relevantProjects;
        this.renderProjects();
      });
    }

    renderContent() {
      const listId = `${this.type}-project-list`;
      this.element.querySelector('ul')!.id = listId;
      this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    }

    private renderProjects() {
      const listEl = document.getElementById(`${this.type}-project-list`)! as HTMLUListElement;
      listEl.innerHTML = '';
      for (const proItem of this.assignedProjects) {
        new ProjectItem(this.element.querySelector('ul')!.id, proItem);
      }
    }
  }

  new ProjectInput();
  new ProjectList('active');
  new ProjectList('finished');
}
