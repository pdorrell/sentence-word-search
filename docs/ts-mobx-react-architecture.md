# Typescript MobX React architecture

This document describes my standard architecture for developing web applications
which should be used for this project.

* Strictly type-checked Typescript
* MobX
* Functional React components
* Vite and esbuild for local development
* SCCS for CSS

## React and MobX

* Avoid unnecessary use of React hooks:
  * useState - use attributes on MobX objects instead
  * useMemo - use 'computed' MobX get properties instead
  
Most React views are views of something - and the something is
normally represented by a MobX object. So the main prop to the
view function will be the MobX object representing the something
that the view is a view of.

This includes the application itself - there is a top-level MobX
object which represents the overall state of the application and
it is passed as a prop to the top-level application view function.

If child MobX objects need to access their parent, do so through
a parent or other suitable attribute on the child object.
(If the child requires only minimal access to parent attributes
or methods, consider defining an interface representing that required
access.)

Do not use React context objects unless specifically told to do so.

## Testing

For tests avoid use of mocks of any kind.

Instead use test doubles. A test double is an object that satisifies
the same interface as the real object that it is a test double for.

When there is a global object that cannot be directly substituted when testing
(ie normally it would be mocked in tests), wrap that object in an object that has an interface
and which can be replaced with a test double for that interface.

## Code Style

* No trailing spaces
* Last line ends with an eoln character

## Workflow

After successfully completing a requested change:

* Run full tests and fix any errors
* Commit to the local repo

## Deployment

Application deployment is via copying the contents of the build in the
`dist` directory to the `deploy` subdirectory by running the `npm run deploy` command.

(I will then manually deploy by a separate process.)
