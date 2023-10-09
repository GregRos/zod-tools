import {
    AnyZodTuple,
    EnumLike,
    ZodAny,
    ZodArray,
    ZodBigInt,
    ZodBoolean,
    ZodBranded,
    ZodCatch,
    ZodDate,
    ZodDefault,
    ZodDiscriminatedUnion,
    ZodDiscriminatedUnionOption,
    ZodEffects,
    ZodEnum,
    ZodFirstPartyTypeKind,
    ZodFunction,
    ZodIntersection,
    ZodLazy,
    ZodLiteral,
    ZodMap,
    ZodNaN,
    ZodNativeEnum,
    ZodNever,
    ZodNull,
    ZodNullable,
    ZodNumber,
    ZodObject,
    ZodOptional,
    ZodPipeline,
    ZodPromise,
    ZodRawShape,
    ZodReadonly,
    ZodRecord,
    ZodSet,
    ZodString,
    ZodSymbol,
    ZodUndefined,
    ZodUnion,
    ZodUnknown,
    ZodVoid
} from "zod";
import { SchemaTableOf, ZodKindedAny } from "./types";

/**
 * This is a table of all the first party schemas. It makes various types
 * aware of all schemas using their preferred types.
 *
 * You will never need to make instances of this class.
 */
export abstract class ZodFirstPartySchemaTable
    implements Record<ZodFirstPartyTypeKind, ZodKindedAny>
{
    ZodEffects!: ZodEffects<ZodKindedAny>;
    ZodPipeline!: ZodPipeline<ZodKindedAny, ZodKindedAny>;
    ZodNativeEnum!: ZodNativeEnum<EnumLike>;
    ZodEnum!: ZodEnum<[string, ...string[]]>;
    ZodDate!: ZodDate;
    ZodPromise!: ZodPromise<ZodKindedAny>;
    ZodReadonly!: ZodReadonly<ZodKindedAny>;
    ZodMap!: ZodMap;
    ZodSet!: ZodSet;
    ZodRecord!: ZodRecord;
    ZodLiteral!: ZodLiteral<any>;
    ZodNull!: ZodNull;
    ZodNaN!: ZodNaN;
    ZodUndefined!: ZodUndefined;
    ZodBoolean!: ZodBoolean;
    ZodString!: ZodString;
    ZodNumber!: ZodNumber;
    ZodBigInt!: ZodBigInt;
    ZodAny!: ZodAny;
    ZodUnknown!: ZodUnknown;
    ZodNever!: ZodNever;
    ZodVoid!: ZodVoid;
    ZodSymbol!: ZodSymbol;
    ZodLazy!: ZodLazy<ZodKindedAny>;
    ZodBranded!: ZodBranded<ZodKindedAny, any>;
    ZodCatch!: ZodCatch<ZodKindedAny>;
    ZodDefault!: ZodDefault<ZodKindedAny>;
    ZodOptional!: ZodOptional<ZodKindedAny>;
    ZodUnion!: ZodUnion<[ZodKindedAny, ...ZodKindedAny[]]>;
    ZodDiscriminatedUnion!: ZodDiscriminatedUnion<
        string,
        ZodDiscriminatedUnionOption<string>[]
    >;
    ZodNullable!: ZodNullable<ZodKindedAny>;
    ZodFunction!: ZodFunction<AnyZodTuple, ZodKindedAny>;
    ZodObject!: ZodObject<ZodRawShape>;
    ZodTuple!: AnyZodTuple;
    ZodIntersection!: ZodIntersection<ZodKindedAny, ZodKindedAny>;
    ZodArray!: ZodArray<ZodKindedAny>;
}
