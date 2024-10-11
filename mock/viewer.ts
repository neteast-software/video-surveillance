import type { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/linker/viewer',
    method: 'get',
    response: () => {
      return {
        code: 0,
        data: {
          name: '设备列表',
          filter: {
            items: [
              {
                component: 'input',
                name: 'name',
                label: '名称',
                showLabel: true,
                attrs: {
                  type: 'text',
                  placeholder: '搜索名称',
                },
                outside: true,
                labelPlacement: 'left',
              },
              {
                component: 'select',
                name: 'system',
                label: '所属系统',
                showLabel: true,
                attrs: {
                  options: [
                    {
                      name: 'access',
                      value: 'access',
                    },
                    {
                      name: 'smart_building',
                      value: 'smart_building',
                    },
                    {
                      name: 'lock',
                      value: 'lock',
                    },
                    {
                      name: 'firefight',
                      value: 'firefight',
                    },
                    {
                      name: 'video',
                      value: 'video',
                    },
                    {
                      name: 'display',
                      value: 'display',
                    },
                    {
                      name: 'visitor',
                      value: 'visitor',
                    },
                    {
                      name: 'device',
                      value: 'device',
                    },
                  ],
                  multiple: true,
                  placeholder: '筛选系统',
                  labelField: 'name',
                  valueField: 'value',
                },
                outside: true,
                labelPlacement: 'left',
              },
              {
                component: 'select',
                name: 'online',
                label: '是否在线',
                showLabel: true,
                attrs: {
                  options: [
                    {
                      name: '在线',
                      value: 1,
                    },
                    {
                      name: '离线',
                      value: 0,
                    },
                  ],
                  placeholder: '筛选在线状态',
                  labelField: 'name',
                  valueField: 'value',
                },
                outside: true,
                labelPlacement: 'left',
              },
              {
                component: 'select',
                name: 'manufacture',
                label: '设备厂家',
                showLabel: true,
                attrs: {
                  options: [
                    {
                      name: 'hikvision',
                      value: 'hikvision',
                    },
                    {
                      name: 'cii',
                      value: 'cii',
                    },
                    {
                      name: 'bzwl',
                      value: 'bzwl',
                    },
                    {
                      name: 'beidaqingniao',
                      value: 'beidaqingniao',
                    },
                    {
                      name: '飞画',
                      value: '飞画',
                    },
                    {
                      name: '狄耐克',
                      value: '狄耐克',
                    },
                    {
                      name: 'zhengyuan',
                      value: 'zhengyuan',
                    },
                    {
                      name: '中智信',
                      value: '中智信',
                    },
                    {
                      name: 'dahua',
                      value: 'dahua',
                    },
                  ],
                  multiple: true,
                  placeholder: '筛选的设备厂家',
                  labelField: 'name',
                  valueField: 'value',
                },
                outside: false,
                labelPlacement: 'left',
              },
              {
                component: 'input',
                name: 'ip_addr',
                label: 'ip地址',
                showLabel: true,
                attrs: {
                  type: 'text',
                  placeholder: '搜索ip地址',
                },
                outside: false,
                labelPlacement: 'left',
              },
              {
                component: 'select',
                name: 'cate_id',
                label: '设备大类',
                showLabel: true,
                attrs: {
                  options: [
                    {
                      name: '智能电表',
                      value: 1,
                    },
                    {
                      name: '智能水表',
                      value: 2,
                    },
                    {
                      name: '空气监测',
                      value: 3,
                    },
                    {
                      name: '温湿度监测',
                      value: 4,
                    },
                    {
                      name: '电梯',
                      value: 5,
                    },
                    {
                      name: '空调',
                      value: 6,
                    },
                    {
                      name: '排水',
                      value: 7,
                    },
                    {
                      name: '集水',
                      value: 8,
                    },
                    {
                      name: '摄像头',
                      value: 9,
                    },
                    {
                      name: '人行道闸',
                      value: 10,
                    },
                    {
                      name: '车辆道闸',
                      value: 11,
                    },
                    {
                      name: '门禁',
                      value: 12,
                    },
                    {
                      name: '智能门锁',
                      value: 13,
                    },
                    {
                      name: '门锁网关',
                      value: 14,
                    },
                    {
                      name: '信息发布屏',
                      value: 15,
                    },
                    {
                      name: '场景面板',
                      value: 16,
                    },
                    {
                      name: '消防',
                      value: 17,
                    },
                    {
                      name: '人体感应器',
                      value: 20,
                    },
                    {
                      name: '照明',
                      value: 21,
                    },
                    {
                      name: '新风',
                      value: 24,
                    },
                  ],
                  placeholder: '筛选设备大类',
                  labelField: 'name',
                  valueField: 'value',
                },
                outside: false,
                labelPlacement: 'left',
              },
              {
                component: 'select',
                name: 'type',
                label: '设备类型',
                showLabel: true,
                attrs: {
                  options: [
                    {
                      name: '未知',
                      value: 0,
                    },
                    {
                      name: '空调',
                      value: 1,
                    },
                    {
                      name: '烟感',
                      value: 2,
                    },
                    {
                      name: '安防探头',
                      value: 3,
                    },
                    {
                      name: '信息屏',
                      value: 4,
                    },
                    {
                      name: '照明',
                      value: 5,
                    },
                    {
                      name: '新风',
                      value: 6,
                    },
                    {
                      name: '门锁',
                      value: 7,
                    },
                    {
                      name: '身份识别终端',
                      value: 8,
                    },
                    {
                      name: '访客机',
                      value: 9,
                    },
                    {
                      name: '食堂消费机',
                      value: 10,
                    },
                    {
                      name: '门锁网关',
                      value: 11,
                    },
                    {
                      name: '智能水表',
                      value: 12,
                    },
                    {
                      name: '智能电表',
                      value: 13,
                    },
                    {
                      name: '冷量表',
                      value: 14,
                    },
                    {
                      name: '热量表',
                      value: 15,
                    },
                    {
                      name: '风机盘管',
                      value: 16,
                    },
                    {
                      name: '风冷热泵',
                      value: 17,
                    },
                    {
                      name: '冷水泵',
                      value: 18,
                    },
                    {
                      name: '智能能量表',
                      value: 19,
                    },
                    {
                      name: '空气监测传感器',
                      value: 20,
                    },
                    {
                      name: '送排风机',
                      value: 21,
                    },
                    {
                      name: '离心风机',
                      value: 22,
                    },
                    {
                      name: '电梯',
                      value: 23,
                    },
                    {
                      name: '人体传感器',
                      value: 24,
                    },
                    {
                      name: '水质传感器',
                      value: 25,
                    },
                    {
                      name: '控制屏',
                      value: 26,
                    },
                    {
                      name: '信息屏',
                      value: 27,
                    },
                    {
                      name: '晨检仪',
                      value: 28,
                    },
                    {
                      name: '留样柜',
                      value: 29,
                    },
                    {
                      name: '验货机',
                      value: 30,
                    },
                    {
                      name: '排风机',
                      value: 31,
                    },
                    {
                      name: '排风排烟机',
                      value: 32,
                    },
                    {
                      name: '防爆排风机',
                      value: 33,
                    },
                    {
                      name: '集水坑',
                      value: 34,
                    },
                    {
                      name: '一氧化碳变送器',
                      value: 35,
                    },
                    {
                      name: '空调外机',
                      value: 36,
                    },
                    {
                      name: '送风机',
                      value: 37,
                    },
                    {
                      name: '全热交换机',
                      value: 38,
                    },
                    {
                      name: '新风面板',
                      value: 39,
                    },
                    {
                      name: '背景广播',
                      value: 40,
                    },
                  ],
                  placeholder: '筛选设备类型',
                  labelField: 'name',
                  valueField: 'value',
                },
                outside: true,
                labelPlacement: 'left',
              },
              {
                component: 'input',
                name: 'name',
                label: '名称',
                showLabel: true,
                attrs: {
                  type: 'text',
                  placeholder: '搜索大类名称',
                },
                outside: false,
                labelPlacement: 'left',
              },
              {
                component: 'cascader',
                name: 'area_id',
                label: '区域',
                showLabel: true,
                attrs: {
                  options: [],
                  placeholder: '搜索区域',
                  childrenField: 'childrenList',
                  remote: true,
                  link: '/system/regionInfo/getRegionTreeList',
                  labelField: 'regionName',
                  valueField: 'id',
                },
                outside: false,
                labelPlacement: 'left',
              },
            ],
            mode: 'complex',
          },
          primary: 'id',
          columns: [
            {
              id: 'id',
              name: 'ID',
              type: 'text',
              dynamicAttrs: {},
            },
            {
              id: 'name',
              name: '设备名称',
              type: 'text',
              dynamicAttrs: {},
            },
            {
              id: 'system',
              name: '所属系统',
              type: 'text',
              dynamicAttrs: {},
            },
            {
              id: 'online',
              name: '是否在线',
              type: 'switch',
              dynamicAttrs: {},
            },
            {
              id: 'cate_id',
              name: '大类id',
              type: 'text',
              expand: true,
              dynamicAttrs: {},
            },
            {
              id: 'type',
              name: '设备类型',
              type: 'text',
              expand: true,
              dynamicAttrs: {},
            },
            {
              id: 'cate_name',
              name: '所属大类',
              type: 'text',
              dynamicAttrs: {},
            },
            {
              id: 'area_id',
              name: '区域id',
              type: 'text',
              expand: true,
              dynamicAttrs: {},
            },
            {
              id: 'area_name',
              name: '区域名称',
              type: 'text',
              dynamicAttrs: {},
            },
            {
              id: 'manufacture',
              name: '设备厂家',
              type: 'text',
              dynamicAttrs: {},
            },
            {
              id: 'asset_id',
              name: '资产编号',
              type: 'text',
              dynamicAttrs: {},
            },
            {
              id: 'unit_type',
              name: '设备型号',
              type: 'text',
              expand: true,
              dynamicAttrs: {},
            },
            {
              id: 'unit_id',
              name: '厂家编号',
              type: 'text',
              expand: true,
              dynamicAttrs: {},
            },
            {
              id: 'ip_addr',
              name: '网络地址',
              type: 'text',
              expand: true,
              dynamicAttrs: {},
            },
            {
              id: 'port',
              name: '服务端口',
              type: 'text',
              expand: true,
              dynamicAttrs: {},
            },
          ],
          size: 30,
          sizes: [
            30,
            50,
            100,
            200,
          ],
          page: 1,
          total: 3745,
          buttons: null,
          row_buttons: [
            {
              attrs: {
                type: 'primary',
              },
              dynamicAttrs: {},
              name: '编辑',
              type: 'button',
              method: 'get',
              link: 'device/console/device/:id/cate/edit',
              icon: '',
            },
            {
              attrs: {
                type: 'primary',
              },
              dynamicAttrs: {},
              name: '配置区域',
              type: 'button',
              method: 'get',
              link: '/linker/richtext',
              icon: '',
            },
          ],
          data: [
            {
              id: 135852,
              name: '门禁控制器MJ-S3F-ZJ-002_门_2',
              system: 'access',
              type: 'BiometricTerminal',
              unit_id: 'be59164ad7324ef8a16c5bbf559c2164',
              unit_type: 'DS-K2604',
              manufacture: 'hikvision',
              online: true,
              ip_addr: '172.16.25.62',
              port: 8000,
              area_id: 1,
              area_name: '南平电力',
              cate_id: 0,
              cate_name: '',
              status: null,
              update_time: '',
              last_online_report: '0001-01-01T00:00:00Z',
              area_from_system: false,
              asset_id: null,
              last_alarm: null,
            },
            {
              id: 135822,
              name: '右权限板_门_1',
              system: 'access',
              type: 'BiometricTerminal',
              unit_id: 'b9da8aa5e5cb4226a8ee723ffdda048b',
              unit_type: 'DS-K3M210-B421',
              manufacture: 'hikvision',
              online: true,
              ip_addr: '172.16.25.90',
              port: 80,
              area_id: 1,
              area_name: '南平电力',
              cate_id: 0,
              cate_name: '',
              status: null,
              update_time: '',
              last_online_report: '0001-01-01T00:00:00Z',
              area_from_system: false,
              asset_id: null,
              last_alarm: null,
            },
            {
              id: 135821,
              name: '人员通道出口2',
              system: 'access',
              type: 'BiometricTerminal',
              unit_id: '9570608ba23546ea8c3a6423d487a625',
              unit_type: 'DS-K5671B-ZU',
              manufacture: 'hikvision',
              online: true,
              ip_addr: '172.16.25.69',
              port: 8000,
              area_id: 1,
              area_name: '南平电力',
              cate_id: 0,
              cate_name: '',
              status: null,
              update_time: '',
              last_online_report: '0001-01-01T00:00:00Z',
              area_from_system: false,
              asset_id: null,
              last_alarm: null,
            },
            {
              id: 135820,
              name: '人员通道进口1',
              system: 'access',
              type: 'BiometricTerminal',
              unit_id: 'a17c92babe47401ca77430b724dcd58c',
              unit_type: 'DS-K5671B-ZU',
              manufacture: 'hikvision',
              online: true,
              ip_addr: '172.16.25.67',
              port: 8000,
              area_id: 1,
              area_name: '南平电力',
              cate_id: 0,
              cate_name: '',
              status: null,
              update_time: '',
              last_online_report: '0001-01-01T00:00:00Z',
              area_from_system: false,
              asset_id: null,
              last_alarm: null,
            },
            {
              id: 135819,
              name: '南206主网自动化运维室',
              system: 'access',
              type: 'BiometricTerminal',
              unit_id: 'e59fb26b733b4402a5959e18bf22bea8',
              unit_type: 'DS-K2604',
              manufacture: 'hikvision',
              online: true,
              ip_addr: '172.16.25.62',
              port: 8000,
              area_id: 82,
              area_name: '2楼',
              cate_id: 0,
              cate_name: '',
              status: null,
              update_time: '',
              last_online_report: '0001-01-01T00:00:00Z',
              area_from_system: false,
              asset_id: null,
              last_alarm: null,
            },
            {
              id: 135818,
              name: '调度控制大厅3',
              system: 'access',
              type: 'BiometricTerminal',
              unit_id: '5559b88d45234e299a7129c4c7b855eb',
              unit_type: 'DS-K2604',
              manufacture: 'hikvision',
              online: true,
              ip_addr: '172.16.25.65',
              port: 8000,
              area_id: 73,
              area_name: '3楼',
              cate_id: 0,
              cate_name: '',
              status: null,
              update_time: '',
              last_online_report: '0001-01-01T00:00:00Z',
              area_from_system: false,
              asset_id: null,
              last_alarm: null,
            },
            {
              id: 135817,
              name: '调度指挥大厅1',
              system: 'access',
              type: 'BiometricTerminal',
              unit_id: '442b24682097470ebea891d3f4793aba',
              unit_type: 'DS-K2604',
              manufacture: 'hikvision',
              online: true,
              ip_addr: '172.16.25.65',
              port: 8000,
              area_id: 73,
              area_name: '3楼',
              cate_id: 0,
              cate_name: '',
              status: null,
              update_time: '',
              last_online_report: '0001-01-01T00:00:00Z',
              area_from_system: false,
              asset_id: null,
              last_alarm: null,
            },
            {
              id: 135816,
              name: '南207-气瓶室',
              system: 'access',
              type: 'BiometricTerminal',
              unit_id: 'e5aace2172054005a6609e51b82cc950',
              unit_type: 'DS-K2604',
              manufacture: 'hikvision',
              online: true,
              ip_addr: '172.16.25.41',
              port: 8000,
              area_id: 82,
              area_name: '2楼',
              cate_id: 0,
              cate_name: '',
              status: null,
              update_time: '',
              last_online_report: '0001-01-01T00:00:00Z',
              area_from_system: false,
              asset_id: null,
              last_alarm: null,
            },
            {
              id: 135815,
              name: '北楼8楼水流指示器89',
              system: 'firefight',
              type: 'SmokeDetector',
              unit_id: '1607',
              unit_type: '1607',
              manufacture: 'beidaqingniao',
              online: false,
              ip_addr: '',
              port: 0,
              area_id: 70,
              area_name: '8楼',
              cate_id: 0,
              cate_name: '',
              status: null,
              update_time: '',
              last_online_report: '0001-01-01T00:00:00Z',
              area_from_system: false,
              asset_id: null,
              last_alarm: null,
            },
            {
              id: 135814,
              name: '北楼8楼信号阀88',
              system: 'firefight',
              type: 'SmokeDetector',
              unit_id: '1606',
              unit_type: '1606',
              manufacture: 'beidaqingniao',
              online: false,
              ip_addr: '',
              port: 0,
              area_id: 70,
              area_name: '8楼',
              cate_id: 0,
              cate_name: '',
              status: null,
              update_time: '',
              last_online_report: '0001-01-01T00:00:00Z',
              area_from_system: false,
              asset_id: null,
              last_alarm: null,
            },
            {
              id: 135813,
              name: '北505-机要室',
              system: 'access',
              type: 'BiometricTerminal',
              unit_id: '07dff6191c804c37b4678f92c459a452',
              unit_type: 'DS-K2604',
              manufacture: 'hikvision',
              online: true,
              ip_addr: '172.16.25.89',
              port: 8000,
              area_id: 67,
              area_name: '5楼',
              cate_id: 0,
              cate_name: '',
              status: null,
              update_time: '',
              last_online_report: '0001-01-01T00:00:00Z',
              area_from_system: false,
              asset_id: null,
              last_alarm: null,
            },
            {
              id: 135812,
              name: '南201配网自动化运维室',
              system: 'access',
              type: 'BiometricTerminal',
              unit_id: '06a018e8bc994bfe8599c3b6dbf09624',
              unit_type: 'DS-K2604',
              manufacture: 'hikvision',
              online: true,
              ip_addr: '172.16.25.62',
              port: 8000,
              area_id: 82,
              area_name: '2楼',
              cate_id: 0,
              cate_name: '',
              status: null,
              update_time: '',
              last_online_report: '0001-01-01T00:00:00Z',
              area_from_system: false,
              asset_id: null,
              last_alarm: null,
            },
            {
              id: 135811,
              name: '调度控制大厅2',
              system: 'access',
              type: 'BiometricTerminal',
              unit_id: '758f13b1c5c547ecb47d72d89c8c2fe8',
              unit_type: 'DS-K2604',
              manufacture: 'hikvision',
              online: true,
              ip_addr: '172.16.25.65',
              port: 8000,
              area_id: 73,
              area_name: '3楼',
              cate_id: 0,
              cate_name: '',
              status: null,
              update_time: '',
              last_online_report: '0001-01-01T00:00:00Z',
              area_from_system: false,
              asset_id: null,
              last_alarm: null,
            },
            {
              id: 135810,
              name: '南301-DTS操作间',
              system: 'access',
              type: 'BiometricTerminal',
              unit_id: 'a5552d891c334552938009caa60b728b',
              unit_type: 'DS-K2604',
              manufacture: 'hikvision',
              online: true,
              ip_addr: '172.16.25.62',
              port: 8000,
              area_id: 73,
              area_name: '3楼',
              cate_id: 0,
              cate_name: '',
              status: null,
              update_time: '',
              last_online_report: '0001-01-01T00:00:00Z',
              area_from_system: false,
              asset_id: null,
              last_alarm: null,
            },
            {
              id: 135809,
              name: '调度控制大厅1',
              system: 'access',
              type: 'BiometricTerminal',
              unit_id: '5586cfcf172749af9b959dbbc224a871',
              unit_type: 'DS-K2604',
              manufacture: 'hikvision',
              online: true,
              ip_addr: '172.16.25.65',
              port: 8000,
              area_id: 73,
              area_name: '3楼',
              cate_id: 0,
              cate_name: '',
              status: null,
              update_time: '',
              last_online_report: '0001-01-01T00:00:00Z',
              area_from_system: false,
              asset_id: null,
              last_alarm: null,
            },
            {
              id: 135808,
              name: '北101-闽延物业部安保班',
              system: 'access',
              type: 'BiometricTerminal',
              unit_id: '66155392723d473e8e70123031bfc93b',
              unit_type: 'DS-K2604',
              manufacture: 'hikvision',
              online: true,
              ip_addr: '172.16.25.34',
              port: 8000,
              area_id: 84,
              area_name: '1楼',
              cate_id: 0,
              cate_name: '',
              status: null,
              update_time: '',
              last_online_report: '0001-01-01T00:00:00Z',
              area_from_system: false,
              asset_id: null,
              last_alarm: null,
            },
            {
              id: 135807,
              name: '南403人资档案室',
              system: 'access',
              type: 'BiometricTerminal',
              unit_id: '655c8959d0d440fcab38001d14ca0f7e',
              unit_type: 'DS-K2604',
              manufacture: 'hikvision',
              online: true,
              ip_addr: '172.16.25.63',
              port: 8000,
              area_id: 26,
              area_name: '4楼',
              cate_id: 0,
              cate_name: '',
              status: null,
              update_time: '',
              last_online_report: '0001-01-01T00:00:00Z',
              area_from_system: false,
              asset_id: null,
              last_alarm: null,
            },
            {
              id: 135806,
              name: '南509-通信蓄电池室',
              system: 'access',
              type: 'BiometricTerminal',
              unit_id: '10c572b172954fcea7d434dee2c109e0',
              unit_type: 'DS-K2604',
              manufacture: 'hikvision',
              online: true,
              ip_addr: '172.16.25.47',
              port: 8000,
              area_id: 27,
              area_name: '5楼',
              cate_id: 0,
              cate_name: '',
              status: null,
              update_time: '',
              last_online_report: '0001-01-01T00:00:00Z',
              area_from_system: false,
              asset_id: null,
              last_alarm: null,
            },
            {
              id: 135805,
              name: '南2楼楼梯前室',
              system: 'access',
              type: 'BiometricTerminal',
              unit_id: '863e0fd02ca54faaa32c1b00ab82aeed',
              unit_type: 'DS-K2604',
              manufacture: 'hikvision',
              online: true,
              ip_addr: '172.16.25.39',
              port: 8000,
              area_id: 82,
              area_name: '2楼',
              cate_id: 0,
              cate_name: '',
              status: null,
              update_time: '',
              last_online_report: '0001-01-01T00:00:00Z',
              area_from_system: false,
              asset_id: null,
              last_alarm: null,
            },
            {
              id: 135804,
              name: '819八楼第一会议室',
              system: 'lock',
              type: 'Lock',
              unit_id: '1787822751936024576',
              unit_type: '784F434B03EC',
              manufacture: 'bzwl',
              online: false,
              ip_addr: '',
              port: 0,
              area_id: 351,
              area_name: '819八楼第一会议室',
              cate_id: 0,
              cate_name: '',
              status: null,
              update_time: '',
              last_online_report: '0001-01-01T00:00:00Z',
              area_from_system: false,
              asset_id: null,
              last_alarm: null,
            },
            {
              id: 135803,
              name: '710建设部办公室',
              system: 'lock',
              type: 'Lock',
              unit_id: '1787823854161367040',
              unit_type: '784F434B039C',
              manufacture: 'bzwl',
              online: false,
              ip_addr: '',
              port: 0,
              area_id: 290,
              area_name: '710建设部办公室',
              cate_id: 0,
              cate_name: '',
              status: null,
              update_time: '',
              last_online_report: '0001-01-01T00:00:00Z',
              area_from_system: false,
              asset_id: null,
              last_alarm: null,
            },
            {
              id: 135802,
              name: '212-文印室',
              system: 'lock',
              type: 'Lock',
              unit_id: '1787816241507995648',
              unit_type: '784F434B0458',
              manufacture: 'bzwl',
              online: false,
              ip_addr: '',
              port: 0,
              area_id: 449,
              area_name: '212自助餐厅',
              cate_id: 0,
              cate_name: '',
              status: null,
              update_time: '',
              last_online_report: '0001-01-01T00:00:00Z',
              area_from_system: false,
              asset_id: null,
              last_alarm: null,
            },
            {
              id: 135801,
              name: '420四楼会议室',
              system: 'lock',
              type: 'Lock',
              unit_id: '1787818529857343488',
              unit_type: '784F434B0502',
              manufacture: 'bzwl',
              online: false,
              ip_addr: '',
              port: 0,
              area_id: 503,
              area_name: '420四楼会议室',
              cate_id: 0,
              cate_name: '',
              status: null,
              update_time: '',
              last_online_report: '0001-01-01T00:00:00Z',
              area_from_system: false,
              asset_id: null,
              last_alarm: null,
            },
            {
              id: 135800,
              name: '419茶歇室',
              system: 'lock',
              type: 'Lock',
              unit_id: '1787443911334170624',
              unit_type: '784F434B0450',
              manufacture: 'bzwl',
              online: false,
              ip_addr: '',
              port: 0,
              area_id: 502,
              area_name: '419茶歇室',
              cate_id: 0,
              cate_name: '',
              status: null,
              update_time: '',
              last_online_report: '0001-01-01T00:00:00Z',
              area_from_system: false,
              asset_id: null,
              last_alarm: null,
            },
            {
              id: 135799,
              name: '南309-调控中心综合管理室',
              system: 'lock',
              type: 'Lock',
              unit_id: '1787826648192782336',
              unit_type: '784F434B03BC',
              manufacture: 'bzwl',
              online: false,
              ip_addr: '',
              port: 0,
              area_id: 154,
              area_name: '南308调控中心综合管理室',
              cate_id: 0,
              cate_name: '',
              status: null,
              update_time: '',
              last_online_report: '0001-01-01T00:00:00Z',
              area_from_system: false,
              asset_id: null,
              last_alarm: null,
            },
            {
              id: 135798,
              name: '南311-会商室',
              system: 'lock',
              type: 'Lock',
              unit_id: '1787827037759737856',
              unit_type: '784F434B03C6',
              manufacture: 'bzwl',
              online: false,
              ip_addr: '',
              port: 0,
              area_id: 159,
              area_name: '南311会商室',
              cate_id: 0,
              cate_name: '',
              status: null,
              update_time: '',
              last_online_report: '0001-01-01T00:00:00Z',
              area_from_system: false,
              asset_id: null,
              last_alarm: null,
            },
            {
              id: 135797,
              name: '南205-自动化设备用房3',
              system: 'access',
              type: 'BiometricTerminal',
              unit_id: '326497d1efa347809ed358e582bff2ec',
              unit_type: 'DS-K2604',
              manufacture: 'hikvision',
              online: true,
              ip_addr: '172.16.25.40',
              port: 8000,
              area_id: 82,
              area_name: '2楼',
              cate_id: 0,
              cate_name: '',
              status: null,
              update_time: '',
              last_online_report: '0001-01-01T00:00:00Z',
              area_from_system: false,
              asset_id: null,
              last_alarm: null,
            },
            {
              id: 135796,
              name: '北407-配线间',
              system: 'access',
              type: 'BiometricTerminal',
              unit_id: 'c247f5959197429592c42a7dc043e574',
              unit_type: 'DS-K2604',
              manufacture: 'hikvision',
              online: true,
              ip_addr: '172.16.25.35',
              port: 8000,
              area_id: 66,
              area_name: '4楼',
              cate_id: 0,
              cate_name: '',
              status: null,
              update_time: '',
              last_online_report: '0001-01-01T00:00:00Z',
              area_from_system: false,
              asset_id: null,
              last_alarm: null,
            },
            {
              id: 135795,
              name: '南706-自动化备件室',
              system: 'access',
              type: 'BiometricTerminal',
              unit_id: 'eab41c5fd78d4ffcb7f3419bcf08cf8c',
              unit_type: 'DS-K2604',
              manufacture: 'hikvision',
              online: true,
              ip_addr: '172.16.25.46',
              port: 8000,
              area_id: 65,
              area_name: '7楼',
              cate_id: 0,
              cate_name: '',
              status: null,
              update_time: '',
              last_online_report: '0001-01-01T00:00:00Z',
              area_from_system: false,
              asset_id: null,
              last_alarm: null,
            },
            {
              id: 135794,
              name: '307-配网调度室1',
              system: 'lock',
              type: 'Lock',
              unit_id: '1787819986631397376',
              unit_type: '784F434B04D6',
              manufacture: 'bzwl',
              online: false,
              ip_addr: '',
              port: 0,
              area_id: 444,
              area_name: '307交接班准备室',
              cate_id: 0,
              cate_name: '',
              status: null,
              update_time: '',
              last_online_report: '0001-01-01T00:00:00Z',
              area_from_system: false,
              asset_id: null,
              last_alarm: null,
            },
          ],
          key: '9ebd678dde03f23997f227db34b029b2',
        },
        type: 'success',
      }
    },
  },
] as MockMethod[]