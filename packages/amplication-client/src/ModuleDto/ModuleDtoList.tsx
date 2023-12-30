import {
  CircularProgress,
  EnumItemsAlign,
  EnumListStyle,
  EnumTextColor,
  EnumTextStyle,
  EnumTextWeight,
  FlexItem,
  List,
  Text,
} from "@amplication/ui/design-system";
import React, { useEffect } from "react";
import useModule from "../Modules/hooks/useModule";
import * as models from "../models";
import { ModuleDtoListItem } from "./ModuleDtoListItem";
import useModuleDto from "./hooks/useModuleDto";

const DATE_CREATED_FIELD = "createdAt";

type Props = {
  moduleId: string;
  resourceId: string;
};
const ModuleDtoList = React.memo(({ moduleId, resourceId }: Props) => {
  const {
    findModuleDtos,
    findModuleDtosData: data,
    findModuleDtosLoading: loading,
  } = useModuleDto();

  const { getModuleData: moduleData } = useModule(moduleId);

  useEffect(() => {
    findModuleDtos({
      variables: {
        where: {
          parentBlock: { id: moduleId },
          resource: { id: resourceId },
        },
        orderBy: {
          [DATE_CREATED_FIELD]: models.SortOrder.Asc,
        },
      },
    });
  }, [moduleId, findModuleDtos, resourceId]);

  return (
    <>
      {loading && <CircularProgress centerToParent />}
      <List
        listStyle={EnumListStyle.Transparent}
        collapsible
        headerContent={
          <FlexItem itemsAlign={EnumItemsAlign.Center}>
            <Text
              textStyle={EnumTextStyle.Normal}
              textColor={EnumTextColor.White}
              textWeight={EnumTextWeight.Bold}
            >
              DTOs
            </Text>
          </FlexItem>
        }
      >
        {data?.ModuleDtos?.map((dto) => (
          <ModuleDtoListItem
            key={dto.id}
            module={moduleData?.Module}
            moduleDto={dto}
          />
        ))}
      </List>
    </>
  );
});

export default ModuleDtoList;
