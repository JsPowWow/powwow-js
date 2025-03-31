import { Reely } from '@pw-internals/jsx-runtime';
import { getCars } from '../../api/api';
import { Spinner } from '../../components/Spinner';

const garageResource = Reely.wrapPromise(getCars);

export const GarageSuspenseContainer = () => {
  const [renderCount, rerender] = Reely.useState(0);
  const [loading, setIsLoading] = Reely.useState(false);

  const referencePrimitive = Reely.useRef(5);
  const referenceData = Reely.useRef({ foo: 'bar' });
  console.log(
    `Garage Container render:${renderCount} ref1:${referencePrimitive.current}, ref2:`,
    referenceData.current
  );

  setIsLoading(true);
  console.log('Garage suspense starts:', renderCount);
  const cars = garageResource.read();
  setIsLoading(false);
  console.log('Garage suspense ends:', cars);

  if (loading) {
    return <Spinner show={loading} />;
  }

  return (
    <Reely.Fragment>
      {!loading && <button onClick={() => rerender((r) => ++r)}>Rerender</button>}
      {/*{!loading && <button onClick={() => setCars([])}>Reload</button>}*/}
      {cars.map((car) => {
        return <div>{`${car.id}, ${car.name}, ${car.color}`}</div>;
      })}
    </Reely.Fragment>
  );
};
