import { StateNode, Editor, TLEventHandlers } from 'tldraw';
import { AspectType, getZoneName, zoneAspectTypes, zoneBgColor, ZoneName } from '@/lib/types';
import { createShapeId } from '@tldraw/tldraw';
import { ulid } from 'ulid';
import AspectShapeUtil from '../../shapes/aspect';
import { BASE_ASPECT_HEIGHT, MIN_ASPECT_WIDTH } from '../../shapes/aspect';

const X_OFFSET = MIN_ASPECT_WIDTH / 2;
const Y_OFFSET = BASE_ASPECT_HEIGHT / 2;

class AspectTypeTool extends StateNode {

  zone: string;

  constructor(editor: Editor, parent?: StateNode) {
    super(editor, parent);
    this.zone = getZoneName(this.id as AspectType);
  }

  override onEnter = () => {
    this.editor.setCursor({ type: 'cross', rotation: 0 });
  };

	override onPointerDown: TLEventHandlers['onPointerDown'] = (info) => {
    const { currentPagePoint } = this.editor.inputs;
    const shapeId = createShapeId(ulid());

    this.editor.createShape({
      id: shapeId,
      type: AspectShapeUtil.type,
      meta: {
        aspectTypes: [this.id],
      },
      x: currentPagePoint.x - X_OFFSET,
      y: currentPagePoint.y - Y_OFFSET,
      props: { 
        zone: this.zone, 
        color: zoneBgColor[this.zone as ZoneName],
        align: 'middle',	 
        w: MIN_ASPECT_WIDTH + 20,
        text: "...",
      }, 
    });

    // Select the newly created shape to edit
    this.editor.setEditingShape(shapeId)
  };
}

class InterestTool extends AspectTypeTool {
  static override id = 'interest';
}

class ValueTool extends AspectTypeTool {
  static override id = 'value';
}

class DreamTool extends AspectTypeTool {
  static override id = 'dream';
}

class InspirationTool extends AspectTypeTool {
  static override id = 'inspiration';
}

class SkillTool extends AspectTypeTool {
  static override id = 'skill';
}

class AccomplishmentTool extends AspectTypeTool {
  static override id = 'accomplishment';
}

class KnowledgeTool extends AspectTypeTool {
  static override id = 'knowledge';
}

class StrengthTool extends AspectTypeTool {
  static override id = 'strength';
}

class InnovationTool extends AspectTypeTool {
  static override id = 'innovation';
}

class ProgressTool extends AspectTypeTool {
  static override id = 'progress';
}

class CommunityTool extends AspectTypeTool {
  static override id = 'community';
}

class ImpactTool extends AspectTypeTool {
  static override id = 'impact';
}

class FinancialFreedomTool extends AspectTypeTool {
  static override id = 'financial-freedom';
}

class BusinessIdeaTool extends AspectTypeTool {
  static override id = 'business-idea';
}

class CareerTool extends AspectTypeTool {
  static override id = 'career';
}

class GrowthTool extends AspectTypeTool {
  static override id = 'growth';
}

export const aspectTypeTools = [
  InterestTool, ValueTool, DreamTool, InspirationTool, 
  SkillTool, AccomplishmentTool, KnowledgeTool, StrengthTool, 
  InnovationTool, ProgressTool, CommunityTool, ImpactTool, 
  FinancialFreedomTool, BusinessIdeaTool, CareerTool, GrowthTool
];


