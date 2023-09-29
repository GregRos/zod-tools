import { ParseInput, ParseReturnType, ZodType, ZodTypeDef } from "zod";
import { ZodFirstPartySchemaTable } from "@lib/zod-first-party-schema-table";

export interface ZodMagicBoxDef extends ZodTypeDef {
    typeName: "magicBox";
    value: any;
}

export class ZodMagicBox extends ZodType<any, ZodTypeDef & ZodMagicBoxDef> {
    _parse(input: ParseInput): ParseReturnType<any> {
        return this._def.value;
    }
}

export class SchemaTableWithMagicBox extends ZodFirstPartySchemaTable {
    magicBox!: ZodMagicBox;
}
