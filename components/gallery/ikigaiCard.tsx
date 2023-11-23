import React from 'react';
import {Card, CardBody, CardFooter} from '@material-tailwind/react';


interface IkigaiCardProps {
  userName: string;
  userAvatar: string;
  images: string[]; // URLs of images
  tags: string[];
}

const IkigaiCard: React.FC<IkigaiCardProps> = ({ userName, userAvatar, images, tags }) => {
  return (
    <Card>
      <div className="flex space-x-2 p-2">
        {images.slice(0, 4).map((image, index) => (
        <img
            className="h-96 w-full object-cover object-center"
            key={index} src={image}
            alt={`Ikigai ${index}`}
        />
        ))}
      </div>

      <CardBody>
        <div className="flex items-center space-x-4">
            <img
                className="h-96 w-full object-cover object-center rounded-full"
                src={userAvatar}
                alt={`${userName}s Avatar`} 
            />
          <h4 className="text-xl">{userName}'s IKIGAI</h4>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag, index) => (
            <span key={index} className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
              {tag}
            </span>
          ))}
        </div>
      </CardBody>

      <CardFooter>
        <button className="btn btn-icon-only rounded-circle">
          {/* <Icon name="settings" className="sm" /> */}
        </button>
        <button className="btn btn-icon-only rounded-circle">
          {/* <Icon name="edit" className="sm" /> */}
        </button>
        <button className="btn btn-icon-only rounded-circle">
          {/* <Icon name="more_vert" className="sm" /> */}
        </button>
      </CardFooter>
    </Card>
  );
};

export default IkigaiCard;
