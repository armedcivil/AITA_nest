import { CreateAdminTable1710084856273 } from './1710084856273-CreateAdminTable';
import { CreateCompanyTable1710172793049 } from './1710172793049-CreateCompanyTable';
import { CreateUserTable1710173810195 } from './1710173810195-CreateUserTable';
import { AddReferenceUserToCompany1710176165432 } from './1710176165432-AddReferenceUserToCompany';
import { AddColumnIconImagePathOnUser1710882512966 } from './1710882512966-AddColumnIconImagePathOnUser';
import { CreateFloorTable1712116401485 } from './1712116401485-CreateFloorTable';
import { AddReferenceFloorToCompany1712117147199 } from './1712117147199-AddReferenceFloorToCompany';
import { CreateEditorAssetsTable1712219021284 } from './1712219021284-CreateEditorAssetsTable';
import { AddViewerKeyOnFloorsTable1712975694146 } from './1712975694146-AddViewerKeyOnFloorsTable';
import { CreateReservationsTable1713204939011 } from './1713204939011-CreateReservationsTable';
import { AddAssetPathIndexToEditorAssetsTable1713577297190 } from './1713577297190-AddAssetPathIndexToEditorAssetsTable';

export const migrations = [
  CreateAdminTable1710084856273,
  CreateCompanyTable1710172793049,
  CreateUserTable1710173810195,
  AddReferenceUserToCompany1710176165432,
  AddColumnIconImagePathOnUser1710882512966,
  CreateFloorTable1712116401485,
  AddReferenceFloorToCompany1712117147199,
  CreateEditorAssetsTable1712219021284,
  AddViewerKeyOnFloorsTable1712975694146,
  CreateReservationsTable1713204939011,
  AddAssetPathIndexToEditorAssetsTable1713577297190,
];
