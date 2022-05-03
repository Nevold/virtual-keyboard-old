import './style.css';

window.onload = () => {
  const app = document.createElement('div');
  app.classList.add('root');
  document.body.append(app);
  const rootNode: HTMLElement | null = document.querySelector('.root');
  // if (rootNode) {
  //   new App(rootNode).start();
  // }
  console.log(rootNode);
};
