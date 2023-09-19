import React, {useState} from 'react';
import IkigaiZone from './ikigaiZone';
import CenterZone from './ikigaiCenterZone';
// import IkigaiEllipseZone from './ikigaiEllipseZone';


const IkigaiBoard: React.FC = () => {
  const [clickedZone, setClickedZone] = useState<string | null>(null);


  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <div className="relative w-[700px] h-[700px]">
        <div className="absolute top-0 left-1/4 transform -translate-y-1/3 -translate-x-1/4 z-10 hover:z-50">
          <IkigaiZone
            name="What you love"
            color="red"
            textPosition="top-12"
            isClicked={clickedZone === 'What you love'}
            onClick={() => setClickedZone('What you love')}
          />
        </div>
        <div className="absolute top-1/4 right-0 transform -translate-y-1/4 translate-x-1/3 z-20 hover:z-50"  >
          <IkigaiZone
            name="What the world needs"
            color="green"
            textPosition="right-12"
            isClicked={clickedZone === 'What you love'}
            onClick={() => setClickedZone('What you love')}
          />
        </div>
        {/* <div className="absolute top-1/3 left-1/2 transform -translate-y-1/2 -translate-x-1/4 rotate-45 z-20 hover:z-10">
          <IkigaiEllipseZone name="Mission = Love and World Needs" color="yellow" textPosition="top-12" />
        </div> */}
        <div className="absolute bottom-0 left-1/4 transform translate-y-1/3 -translate-x-1/4 z-30 hover:z-50">
          <IkigaiZone
            name="What you can be paid for"
            color="yellow"
            textPosition="bottom-12"
            isClicked={clickedZone === 'What you love'}
            onClick={() => setClickedZone('What you love')}
          />
        </div>
        <div className="absolute top-1/4 left-0 transform -translate-y-1/4 -translate-x-1/3 z-40 hover:z-50">
          <IkigaiZone
            name="What you are good at"
            color="blue"
            textPosition="left-12"
            isClicked={clickedZone === 'What you love'}
            onClick={() => setClickedZone('What you love')}
          />
        </div>
        {/* <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 z-50 hover:z-50">
          <CenterZone/>
        </div> */}
      </div>
    </div>
  );
};

export default IkigaiBoard;
