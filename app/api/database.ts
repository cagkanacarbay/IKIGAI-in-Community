import { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'

// Define the interface for each table
interface IkigaiTable {
    ikigai_id: Generated<number>;
    // add other columns if necessary
  }
  
  interface ItemTable {
    item_id: Generated<number>;
    ikigai_id: number;
    type: string;
    text: string | null;
    image_url: string | null;
  }
  
  interface PositionTable {
    position_id: Generated<number>;
    item_id: number;
    x_position: number;
    y_position: number;
    timestamp: Date;
  }
  
  interface Database {
    ikigai: IkigaiTable;
    items: ItemTable;
    positions: PositionTable;
  }

  export type {Database, ItemTable, PositionTable, IkigaiTable};
  