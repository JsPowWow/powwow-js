import { Reely } from '@pw-internals/jsx-runtime';
import { GarageDataType, getCars } from '../../api/api';
import { Spinner } from '../../components/Spinner';

export const GarageContainer = () => {
  const [cars, setCars] = Reely.useState<GarageDataType[]>([]);
  const [loading, setIsLoading] = Reely.useState(true);

  Reely.useEffect(() => {
    console.log('Garage Container');
    getCars().then((c) => {
      setCars(c);
      setIsLoading(false);
    });
  }, []);

  // {/*{loading && 'Loading...'} TODO AR do not render falsy values*/}

  if (loading) {
    return <Spinner show={loading} />;
  }

  return (
    <Reely.Fragment>
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
