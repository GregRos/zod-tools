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
// We do it like this because it performs so much better
// than something like:
// ```
// export type ZodFirstPartySchema = ZodEffects | ZodPipeline | ...
// ```
// And then manipulating the result with `Expect`.
export abstract class ZodFirstPartySchemaTable
    implements SchemaTableOf<ZodFirstPartyTypeKind>
{
    [key: string]: ZodKindedAny;

    [ZodFirstPartyTypeKind.ZodEffects]!: ZodEffects<ZodKindedAny>;
    [ZodFirstPartyTypeKind.ZodPipeline]!: ZodPipeline<
        ZodKindedAny,
        ZodKindedAny
    >;
    [ZodFirstPartyTypeKind.ZodNativeEnum]!: ZodNativeEnum<EnumLike>;
    [ZodFirstPartyTypeKind.ZodEnum]!: ZodEnum<[string, ...string[]]>;
    [ZodFirstPartyTypeKind.ZodDate]!: ZodDate;
    [ZodFirstPartyTypeKind.ZodPromise]!: ZodPromise<ZodKindedAny>;
    [ZodFirstPartyTypeKind.ZodReadonly]!: ZodReadonly<ZodKindedAny>;
    [ZodFirstPartyTypeKind.ZodMap]!: ZodMap;
    [ZodFirstPartyTypeKind.ZodSet]!: ZodSet;
    [ZodFirstPartyTypeKind.ZodRecord]!: ZodRecord;
    [ZodFirstPartyTypeKind.ZodLiteral]!: ZodLiteral<any>;
    [ZodFirstPartyTypeKind.ZodNull]!: ZodNull;
    [ZodFirstPartyTypeKind.ZodNaN]!: ZodNaN;
    [ZodFirstPartyTypeKind.ZodUndefined]!: ZodUndefined;
    [ZodFirstPartyTypeKind.ZodBoolean]!: ZodBoolean;
    [ZodFirstPartyTypeKind.ZodString]!: ZodString;
    [ZodFirstPartyTypeKind.ZodNumber]!: ZodNumber;
    [ZodFirstPartyTypeKind.ZodBigInt]!: ZodBigInt;
    [ZodFirstPartyTypeKind.ZodAny]!: ZodAny;
    [ZodFirstPartyTypeKind.ZodUnknown]!: ZodUnknown;
    [ZodFirstPartyTypeKind.ZodNever]!: ZodNever;
    [ZodFirstPartyTypeKind.ZodVoid]!: ZodVoid;
    [ZodFirstPartyTypeKind.ZodSymbol]!: ZodSymbol;
    [ZodFirstPartyTypeKind.ZodLazy]!: ZodLazy<ZodKindedAny>;
    [ZodFirstPartyTypeKind.ZodBranded]!: ZodBranded<ZodKindedAny, any>;
    [ZodFirstPartyTypeKind.ZodCatch]!: ZodCatch<ZodKindedAny>;
    [ZodFirstPartyTypeKind.ZodDefault]!: ZodDefault<ZodKindedAny>;
    [ZodFirstPartyTypeKind.ZodOptional]!: ZodOptional<ZodKindedAny>;
    [ZodFirstPartyTypeKind.ZodUnion]!: ZodUnion<
        [ZodKindedAny, ...ZodKindedAny[]]
    >;
    [ZodFirstPartyTypeKind.ZodDiscriminatedUnion]!: ZodDiscriminatedUnion<
        string,
        ZodDiscriminatedUnionOption<string>[]
    >;
    [ZodFirstPartyTypeKind.ZodNullable]!: ZodNullable<ZodKindedAny>;
    [ZodFirstPartyTypeKind.ZodFunction]!: ZodFunction<
        AnyZodTuple,
        ZodKindedAny
    >;
    [ZodFirstPartyTypeKind.ZodObject]!: ZodObject<ZodRawShape>;
    [ZodFirstPartyTypeKind.ZodTuple]!: AnyZodTuple;
    [ZodFirstPartyTypeKind.ZodIntersection]!: ZodIntersection<
        ZodKindedAny,
        ZodKindedAny
    >;
    [ZodFirstPartyTypeKind.ZodArray]!: ZodArray<ZodKindedAny>;
}
