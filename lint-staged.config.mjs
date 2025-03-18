export default {
  '{packages,tools}/**/*.{ts,js,json,md,html,css,scss}': [
    'nx affected --target typecheck',
    'nx affected --target lint', //  --uncommited --fix true
    'nx affected --target test', // --uncommited
    'nx format:write', // --uncommited
  ],
};
