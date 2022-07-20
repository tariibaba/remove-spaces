import removeSpaces from './remove-spaces';

const text = `    <div>    
      <p></p>    
    </div>    `;

it('removes leading spaces without preserving indent', () => {
  const expectation = `<div>    
<p></p>    
</div>    `;
  const result = removeSpaces({
    text,
    leading: true,
    trailing: false,
    preserveIndent: false,
  });
  expect(result).toBe(expectation);
});

it('removes leading spaces and preserves indent', () => {
  const expectation = `<div>    
  <p></p>    
</div>    `;
  const result = removeSpaces({
    text,
    leading: true,
    trailing: false,
    preserveIndent: true,
  });
  expect(result).toBe(expectation);
});

it('removes trailing spaces', () => {
  const expectation = `    <div>
      <p></p>
    </div>`;
  const result = removeSpaces({
    text,
    leading: false,
    trailing: true,
    preserveIndent: false,
  });
  expect(result).toBe(expectation);
});

it('removes leading and trailing spaces', () => {
  const expectation = `<div>
<p></p>
</div>`;
  const result = removeSpaces({
    text,
    leading: true,
    preserveIndent: false,
    trailing: true,
  });
  expect(result).toBe(expectation);
});
