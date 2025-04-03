import examples from './examples';

export const TestPage = () => {
  return (
    <ul class='tree-view has-container'>
      <li>
        Table of Contents: What is the&nbsp;
        <strong>
          <code>🥸 Reely</code>
        </strong>
        &nbsp;available functionality?
      </li>
      {examples.map((Demo) => (
        <li>
          <Demo />
        </li>
      ))}
    </ul>
  );
};
