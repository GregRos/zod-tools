import { ZodType, ZodTypeDef } from "zod";

/**
 * Gets the `ZodDef` type of a schema instance.
 */
export type ZodKindedTypeDef<Kind extends string = string> = ZodTypeDef & {
    typeName: Kind;
};

export type KindedAny<Kind extends string = string> = {
    _def: ZodKindedTypeDef<Kind>;
};

/**
 * Works like `ZodTypeAny`, but with a `_def.typeName` that doesn't evaluate to `any`.
 * @template TypeName The name of the schema node.
 */
export type ZodKindedAny<Kind extends string = string> = ZodType<
    any,
    ZodKindedTypeDef<Kind>,
    any
>;

/**
 * The `_def` type of a schema instance.
 * @template Z The type of a Zod schema.
 */
export type ZodDefOf<ZSchema extends KindedAny> = ZSchema["_def"];

/**
 * Gets the type of a schema instance's `_def.typeName`.
 */
export type ZodKindOf<ZSchema extends KindedAny> = ZSchema["_def"]["typeName"];
/**
 * A schema table is an object type whose keys are the `_def.typeName`s
 * of schema instances and the values are schema instance types. This type
 * is implemented in {@link ZodFirstPartySchemaTable}.
 *
 * This type is only used for type checking. You will never need to
 * provide a value of this type.
 */
export type InTableOf<InTable> = {
    [K in keyof InTable]: KindedAny<K & string>;
};

export type NodeFromTable<InTable extends InTableOf<InTable>> =
    InTable[keyof InTable & string];
