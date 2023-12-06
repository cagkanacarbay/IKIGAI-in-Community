import React from 'react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ToolbarProps {
  handleSaveBoard: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ handleSaveBoard }) => {
  return (
    <div>
      <Button className="absolute top-1 left-1" onClick={handleSaveBoard}>Save Board</Button>
      <div className="absolute top-1 right-1 rounded-full ">
        <Popover>
          <PopoverTrigger asChild><Button variant="outline">?</Button></PopoverTrigger>
          <PopoverContent>
              <h3 className="font-bold mb-2">Instructions</h3>
              <p className="max-w-sm mb-2"><strong>Right click</strong> to add a new tag or image.</p>
              <p className="max-w-sm mb-2"><strong>Right click</strong> on an existing tag or image to edit or delete.</p>
              <p className="max-w-sm mb-4"><strong>Drag & drop</strong> tags and images find their places in your Ikigai.</p>
              <h3 className="font-bold mb-2">Zoom In/Out</h3>
              <p className="max-w-sm mb-2">Hold down <strong>CTRL/CMD</strong> and use your mouse wheel to zoom in.</p>
              <p className="max-w-sm mb-2">Or double click anywhere to zoom in, and again to zoom back out.</p>
              <p className="max-w-sm mb-2">When zoomed in, move around with a left mouse click or by holding down the mouse wheel.</p>
            </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Toolbar;
