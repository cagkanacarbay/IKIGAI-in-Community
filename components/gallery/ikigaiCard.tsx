import React from 'react';
import { 
  Card, CardBody, CardHeader, Avatar,
  Typography, CardFooter, Carousel 
} from '@material-tailwind/react';


interface IkigaiCardProps {
  userName: string;
  userAvatar: string;
  images: string[]; 
  tags: string[];
}

const IkigaiCard: React.FC<IkigaiCardProps> = ({ userName, userAvatar, images, tags }) => {
  return (

    <Card className="max-w-sm mx-auto bg-blue-gray-200">
      <CardHeader
            // variant="filled"
            // color="white"
            className="flex items-center justify-center px-6 shadow-md bg-blue-gray-100"
            floated={false}
            shadow={false}
          >
          <div className="flex-grow border-t border-gray-700"></div>
          <Avatar
            size="sm"
            variant="circular"
            alt={userName}
            src={userAvatar}
            className="border-2 border-white hover:z-10"
          />
          <Typography variant="h5" color="black" className='px-2'>
            {userName}
          </Typography>
          <div className="flex-grow border-t border-gray-700"></div>
      </CardHeader>
      <CardBody className=''>
        <Carousel className="rounded-md shadow-md rounded-xl bg-blue-gray-100">
          {images.map((image, index) => (
            <div key={index} className="h-48 md:h-64 w-full relative rounded-xl "> {/* Adjust the height here */}
              <img
                key={index}
                src={image}
                alt={`Ikigai ${index}`}
                className="h-full w-full object-contain rounded-xl"
              />
            </div>
          ))}
        </Carousel>  

      </CardBody>
      <CardFooter className='pt-0 bg-blue-gray-200'>
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
