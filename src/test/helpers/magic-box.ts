import { ParseInput, ParseReturnType, ZodType, ZodTypeDef } from "zod";
import { ZodFirstPartyNodesTable } from "@lib";

export interface ZodMagicBoxDef extends ZodTypeDef {
    typeName: "magicBox";
    value: any;
}

export class ZodMagicBox extends ZodType<any, ZodTypeDef & ZodMagicBoxDef> {
    _parse(input: ParseInput): ParseReturnType<any> {
        return this._def.value;
    }
}

export class SchemaTableWithMagicBox extends ZodFirstPartyNodesTable {
    magicBox!: ZodMagicBox;
}
