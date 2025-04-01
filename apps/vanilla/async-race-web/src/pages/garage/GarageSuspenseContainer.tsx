import { Reely } from '@pw-internals/jsx-runtime';
import { getCars } from '../../api/api';

const garageResource = Reely.wrapPromise(getCars);

export const GarageSuspenseContainer = () => {
  const [renderCount, rerender] = Reely.useState(0);
  // const [loading, setIsLoading] = Reely.useState(false);

  // const referencePrimitive = Reely.useRef(5);
  //console.log(`Garage Container render:${renderCount} ref1:${referencePrimitive.current}`);

  console.log('Garage suspense starts:', renderCount);
  const cars = garageResource.read(renderCount);
  console.log('Garage suspense ends:', cars);

  return (
    <Reely.Fragment>
      {/*{`Render Count: ${renderCount}`}*/}
      <button onClick={() => rerender((r) => ++r)}>Rerender</button>
      {cars.map((car) => {
        return <span>{`${car.id}, ${car.name}, ${car.color}`}</span>;
      })}
    </Reely.Fragment>
  );
};
