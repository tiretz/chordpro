from pydantic import AliasChoices, AliasGenerator, ConfigDict, BaseModel
from pydantic.alias_generators import to_camel, to_snake


class BaseSchema(BaseModel):
    model_config = ConfigDict(
        alias_generator=AliasGenerator(
            validation_alias=lambda field_name: AliasChoices(to_camel(field_name), to_snake(field_name)),
            serialization_alias=lambda field_name: to_camel(field_name),
        )
    )
