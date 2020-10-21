/// <reference path="./Components/ProjectList.ts" />
/// <reference path="./Components/ProjectInput.ts" />

namespace App {
  new ProjectInput();
  new ProjectList('active');
  new ProjectList('finished');
}
