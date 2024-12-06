export interface ProjectDetail {
  /**
   * 项目简称
   */
  abbr: string;
  /**
   * 项目审批或核准概况
   */
  approvalSummary: string;
  /**
   * 所属地市
   */
  city: string;
  /**
   * 竣工日期
   */
  completionDate: string;
  /**
   * 建设工期
   */
  constructionPeriod: number;
  /**
   * 建设规模
   */
  constructionScale: string;
  /**
   * 建设标准
   */
  constructionStandards: string;
  /**
   * 建设规模、主要技术标准
   */
  constructionTechStandards: string;
  /**
   * 项目终点
   */
  endPoint: string;
  /**
   * 概算总投资
   */
  estimatedInvestment: number;
  /**
   * 项目全称
   */
  fullName: string;
  /**
   * 资金来源
   */
  fundingSource: string;
  id: number;
  /**
   * 全线用地批复时间
   */
  landApprovalDate: string;
  /**
   * 通车日期
   */
  operationStartDate: string;
  /**
   * 项目建设意义与主要效益
   */
  projectSignificanceBenefits: string;
  /**
   * 项目状态 1：筹备中  2：建设中 3：已交工 4：已竣工
   */
  projectStatus: string;
  /**
   * 项目途经
   */
  route: string;
  /**
   * 路线性质
   */
  routeNature: string;
  /**
   * 开工日期
   */
  startDate: string;
  /**
   * 项目起点
   */
  startPoint: string;
  [property: string]: any;
}
