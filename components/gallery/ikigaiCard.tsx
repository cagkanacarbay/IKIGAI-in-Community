import React from 'react';
import { 
  Card, CardBody, CardHeader,
  Typography, CardFooter, Carousel 
} from '@material-tailwind/react';
import { useRouter } from 'next/router';

interface IkigaiCardProps {
  ikigaiId: string,
  userName: string;
  images: string[]; 
  tags: string[];
}

const IkigaiCard: React.FC<IkigaiCardProps> = ({ ikigaiId, userName, images, tags }) => {
  const router = useRouter();

  // Click handler to navigate to the Ikigai details page
  const handleCardClick = () => {
    router.push(`/ikigai/${ikigaiId}`);
  };

  const handleCarouselClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (

    <Card className="max-w-sm mx-auto bg-blue-gray-200 hover:bg-blue-gray-300" onClick={handleCardClick}>
      <CardHeader
            // variant="filled"
            // color="white"
            className="flex items-center justify-center px-6 shadow-md bg-blue-gray-100"
            floated={false}
            shadow={false}
          >
          <div className="flex-grow border-t border-gray-700"></div>
          {/* <Avatar
            size="sm"
            variant="circular"
            alt={userName}
            src={userAvatar}
            className="border-2 border-white hover:z-10"
          /> */}
          <Typography variant="h5" color="black" className='px-2'>
            {userName}
          </Typography>
          <div className="flex-grow border-t border-gray-700"></div>
      </CardHeader>
      <CardBody className=''>
        <Carousel className="rounded-md shadow-md rounded-xl bg-blue-gray-100" onClick={handleCarouselClick}>
          {images.map((image, index) => (
            <div key={index} className="h-48 md:h-64 w-full relative rounded-xl "> {/* Adjust the height here */}
              <img
                key={index}
                src={image}
                alt={`Ikigai ${index}`}
                className="h-full w-full object-contain rounded-xl"
                onClick={handleCarouselClick}
              />
            </div>
          ))}
        </Carousel>  

      </CardBody>
      <CardFooter className='pt-0'>
        <div className="flex flex-wrap justify-center gap-1">
          {tags.map((tag, index) => (
            <span key={index} className="rounded-full shadow-xs px-3 py-1 text-sm text-black bg-white m-1">
              {tag}
            </span>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};

export default IkigaiCard;
