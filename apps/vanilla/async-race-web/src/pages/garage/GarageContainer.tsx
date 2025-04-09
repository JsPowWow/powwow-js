import Reely from '@powwow-js/reely';
import { GarageDataType, getCars } from '../../api/api';
import { Spinner } from '../../components/Spinner';

export const GarageContainer = () => {
  const [renderCount, rerender] = Reely.useState(0);
  const [cars, setCars] = Reely.useState<GarageDataType[]>([]);
  const [loading, setIsLoading] = Reely.useState(true);

  const referencePrimitive = Reely.useRef(5);
  const referenceData = Reely.useRef({ foo: 'bar' });
  console.log(
    `Garage Container render:${renderCount} ref1:${referencePrimitive.current}, ref2:`,
    referenceData.current
  );

  Reely.useEffect(() => {
    if (cars.length === 0) {
      setIsLoading(true);
      getCars()
        .then(setCars)
        .finally(() => setIsLoading(false));
    }
  }, [cars]);

  // {/*{loading && 'Loading...'} TODO AR do not render falsy values*/}

  if (loading) {
    return <Spinner show={loading} />;
  }

  return (
    <Reely.Fragment>
      {!loading && <button onClick={() => rerender((r) => ++r)}>Rerender</button>}
      {!loading && <button onClick={() => setCars([])}>Reload</button>}
      {cars.map((car) => {
        return <div>{`${car.id}, ${car.name}, ${car.color}`}</div>;
      })}
    </Reely.Fragment>
  );
};

// WORKS
// <div>
//   <Spinner show={loading} />
//   {cars.map((car) => {
//     return <div>{`${car.id}, ${car.name}, ${car.color}`}</div>;
//   })}
// </div>

// WORKS
// <Reely.Fragment>
//   {loading ? (
//     <Spinner show={loading} />
//   ) : (
//     cars.map((car) => {
//       return <div>{`${car.id}, ${car.name}, ${car.color}`}</div>;
//     })
//   )}
// </Reely.Fragment>

// <div>
//   {loading ? (
//     <Spinner show={loading} />
//   ) : (
//     cars.map((car) => {
//       return <div>{`${car.id}, ${car.name}, ${car.color}`}</div>;
//     })
//   )}
// </div>

// Not Works, falsy values ?
// <Reely.Fragment>
//   {loading && <Spinner show />}
//   {!loading &&
//     cars.map((car) => {
//       return <div>{`${car.id}, ${car.name}, ${car.color}`}</div>;
//     })}
// </Reely.Fragment>
