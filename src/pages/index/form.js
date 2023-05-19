/**
 * 基础信息
 * @type {[{label: string, placeholder: string, key: string},{label: string, placeholder: string, type: string, key: string},{label: string, placeholder: string, key: string},{label: string, placeholder: string, key: string}]}
 */
export const driverForm = [
  {
    key: 'driverName',
    label: '司机姓名',
    placeholder: '请输入司机姓名',
  }, {
    key: 'identityCard',
    label: '身份证号',
    placeholder: '请输入身份证号',
    type: 'idcard',
  }, {
    key: 'driverPhone',
    label: '联系电话',
    placeholder: '请输入联系电话',
  }, {
    key: 'address',
    label: '家庭住址',
    placeholder: '请输入家庭住址',
  },
]

/**
 * 驾驶证输入信息
 * @type {[{label: string, placeholder: string, row: string, key: string},{label: string, placeholder: string, row: string, key: string},{label: string, placeholder: string, row: string, key: string}]}
 */
export const driveLicenseForm = [
  {
    key: 'driveLicenseCode',
    label: '驾驶证编号',
    placeholder: '请输入驾驶证编号',
    row: 'row-start-1',
  }, {
    key: 'permitDriveVehicle',
    label: '准假车型',
    placeholder: '请输入准假车型',
    row: 'row-start-2',
  }, {
    key: 'filesCode',
    label: '档案编号',
    placeholder: '请输入档案编号',
    row: 'row-start-6',
  },
]

/**
 * 驾驶证日期选择
 * @type {[{label: string, placeholder: string, picker: string, row: string, key: string},{label: string, placeholder: string, picker: string, row: string, key: string},{label: string, placeholder: string, picker: string, row: string, key: string}]}
 */
export const driveLicenseTimeForm = [
  {
    key: 'startTime',
    label: '生效期',
    placeholder: '请选择',
    row: 'row-start-3',
  }, {
    key: 'endTime',
    label: '失效期',
    placeholder: '请选择',
    row: 'row-start-4',
  }, {
    key: 'drawTime',
    label: '初次领证日期',
    placeholder: '请选择',
    row: 'row-start-5',
  },
]

/**
 *  网约车
 * @type {[{label: string, placeholder: string, key: string},{label: string, placeholder: string, key: string}]}
 */
export const onlineCarForm = [
  {
    key: 'qualificaCode',
    label: '资格证号',
    placeholder: '请输入资格证号',
  }, {
    key: 'issuingAuthority',
    label: '发证机构',
    placeholder: '请输入发证机构',
  },
]

/**
 * 网约车日期选择
 * @type {[{label: string, placeholder: string, key: string},{label: string, placeholder: string, key: string},{label: string, placeholder: string, key: string},{label: string, placeholder: string, key: string},{label: string, placeholder: string, key: string}]}
 */
export const onlineCarTimeForm = [
  {
    key: 'issuingTime',
    label: '发证日期',
    placeholder: '请选择',
  }, {
    key: 'theFirstTime',
    label: '初次领证日期',
    placeholder: '请选择',
  }, {
    key: 'effectiveStartTime',
    label: '生效期',
    placeholder: '请选择',
  }, {
    key: 'effectiveEndTime',
    label: '失效期',
    placeholder: '请选择',
  }, {
    key: 'reportingTime',
    label: '报备日期',
    placeholder: '请选择',
  }]
