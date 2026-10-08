import Query from "@arcgis/core/rest/support/Query.js";

export async function AggregateChartData(features) {
  const QuarterGroupingDict ={}
  // console.log("features", features)
  features.forEach((feature) => {
    if (!QuarterGroupingDict[`${feature?.attributes?.year_}${feature?.attributes?.quarter}`]) {
      QuarterGroupingDict[`${feature?.attributes?.year_}${feature?.attributes?.quarter}`] = [feature?.attributes]
    } else {
      QuarterGroupingDict[`${feature?.attributes?.year_}${feature?.attributes?.quarter}`]?.push(feature?.attributes)
    }
  })
  // console.log("Chart Features",QuarterGroupingDict)
  const ChartDataDict = {}
  Object.values(QuarterGroupingDict).forEach((featureGroup) =>{
    const InventorySum = featureGroup.reduce((accumulator, feature) => {
      // Add the value of the specified key from the current dictionary to the accumulator
      return accumulator + feature?.sum_of_inventory;
    }, 0);
    const DirectVacancySum = featureGroup.reduce((accumulator, feature) => {
      // Add the value of the specified key from the current dictionary to the accumulator
      return accumulator + feature?.sum_of_directvacantspace;
    }, 0);
    const AbsorptionSum = featureGroup.reduce((accumulator, feature) => {
      // Add the value of the specified key from the current dictionary to the accumulator
      return accumulator + feature?.sum_of_absorption;
    }, 0);
    const NewSupplyList = featureGroup.reduce((accumulator, feature) => {
      // Add the value of the specified key from the current dictionary to the accumulator
      return accumulator + feature?.sum_of_newsupply;
    }, 0); 
    const AggregateReportDict = {
      DirectVacancyRate: (DirectVacancySum/InventorySum)*100,
      AbsorptionSum: AbsorptionSum,
      NewSupplySum: NewSupplyList,
      Quarter: featureGroup[0]?.quarter,
      Year: featureGroup[0]?.year_
    }
    ChartDataDict[`${featureGroup[0]?.year_}${featureGroup[0]?.quarter}`] = AggregateReportDict
  })
  // console.log("Chart Data",ChartDataDict)
  const ChartInput = {
    Vacancy: [],
    Absorption: [],
    NewSupply: []
  }
  const ChartLabels = []
  const keys = Object.keys(ChartDataDict).sort((a, b) => a - b)
  keys.forEach((key) => {
    const values = ChartDataDict[key]
    ChartInput?.Vacancy?.push(values?.DirectVacancyRate)
    ChartInput?.Absorption.push(values?.AbsorptionSum)
    ChartInput?.NewSupply.push(values?.NewSupplySum)
    ChartLabels.push(`Q${values?.Quarter} ${values?.Year}`)
  })
  const ChartConfig ={
    data: ChartInput,
    labels: ChartLabels
  }
  // console.log("ChartConfig", ChartConfig)
  return ChartConfig
}

export async function AggregateReportData(features) {
    const InventorySum = features.reduce((accumulator, feature) => {
      return accumulator + feature?.attributes?.sum_of_inventory;
    }, 0);
    const SumInventoryLastYear = features.reduce((accumulator, feature) => {
      return accumulator + feature?.attributes?.sum_of_inventoryprevyear;
    }, 0);
    const SumInventoryLastQ = features.reduce((accumulator, feature) => {
      return accumulator + feature?.attributes?.sum_of_inventoryprevquarter;
    }, 0);
    const DirectVacancySum = features.reduce((accumulator, feature) => {
      return accumulator + feature?.attributes?.sum_of_directvacantspace;
    }, 0);
    const OverallVacancy = features.reduce((accumulator, feature) => {
      return accumulator + feature?.attributes?.sum_of_totalvacantspace;
    }, 0);
    const SumOverallVacancyLastYear = features.reduce((accumulator, feature) => {
      return accumulator + feature?.attributes?.sum_of_totalvacantspaceprevyear;
    }, 0);
    const SumOverallVacancyLastQ = features.reduce((accumulator, feature) => {
      return accumulator + feature?.attributes?.sum_of_totalvacantspaceprevquarter;
    }, 0);
    const AbsorptionSum = features.reduce((accumulator, feature) => {
      return accumulator + feature?.attributes?.sum_of_absorption;
    }, 0);
    const SumAbsorptionLastYear = features.reduce((accumulator, feature) => {
      return accumulator + feature?.attributes?.sum_of_absorption_prevyr;
    }, 0);
    const SumAbsorptionLastQ = features.reduce((accumulator, feature) => {
      return accumulator + feature?.attributes?.sum_of_absorption_prevq;
    }, 0);
    const SumConstruction = features.reduce((accumulator, feature) => {
      return accumulator + feature?.attributes?.sum_of_underconstruction;
    }, 0);    
    const SumConstructionLastYear = features.reduce((accumulator, feature) => {
      return accumulator + feature?.attributes?.sum_of_underconstructionprevyr;
    }, 0);    
    const SumConstructionLastQ = features.reduce((accumulator, feature) => {
      return accumulator + feature?.attributes?.sum_of_underconstructionprevq;
    }, 0);  
    const NewSupplyList = features.reduce((accumulator, feature) => {
      return accumulator + feature?.attributes?.sum_of_newsupply;
    }, 0);  
    const SumNewSupplyLastYear = features.reduce((accumulator, feature) => {
      return accumulator + feature?.attributes?.sum_of_newsupplyprevyr;
    }, 0);  
    const SumNewSupplyLastQ = features.reduce((accumulator, feature) => {
      return accumulator + feature?.attributes?.sum_of_newsupplyprevq;
    }, 0);  
    const ClassALeaseRate = []
    const LeaseRates = []
    const LeaseRatesLastYear = []
    const LeaseRatesLastQ = []
    features.forEach((feature) => {
      if (feature?.attributes?.class === "A" && feature?.attributes?.weightedaveragerent !== null) {
        ClassALeaseRate.push(feature?.attributes?.weightedaveragerent)
      }
      if (feature?.attributes?.weightedaveragerent !== null) {
        LeaseRates.push(feature?.attributes?.weightedaveragerent)
      }
      if (feature?.attributes?.weightedaveragerent_prevyr !== null) {
        LeaseRatesLastYear.push(feature?.attributes?.weightedaveragerent_prevyr)
      }
      if (feature?.attributes?.weightedaveragerent_prevq !== null) {
        LeaseRatesLastQ.push(feature?.attributes?.weightedaveragerent_prevq)
      }
    })
    const absorptionForecast = features?.[0]?.attributes?.absorptionforecast
    const vacancyForecast = features?.[0]?.attributes?.vacancyforecast
    const constructionForecast = features?.[0]?.attributes?.constructionforecast
    const rentForecast = features?.[0]?.attributes?.rentforecast
    const rentTrend = features?.[0]?.attributes?.renttrend
    const AggregateReportDict = {
      classALeaseRates: ((ClassALeaseRate?.reduce((accumulator, currentValue) => accumulator + currentValue, 0))/ClassALeaseRate?.length),
      RentForecast: rentForecast,
      RentTrend: rentTrend,
      LeaseRates: ((LeaseRates?.reduce((accumulator, currentValue) => accumulator + currentValue, 0))/LeaseRates?.length),
      LeaseRatePrevYr: ((LeaseRatesLastYear?.reduce((accumulator, currentValue) => accumulator + currentValue, 0))/LeaseRatesLastYear?.length),
      LeaseRatesLastQ: ((LeaseRatesLastQ?.reduce((accumulator, currentValue) => accumulator + currentValue, 0))/LeaseRatesLastQ?.length),
      InventorySum: InventorySum,
      InventoryLastYr: SumInventoryLastYear,
      InventoryLastQ: SumInventoryLastQ,
      DirectVacancySum: DirectVacancySum,
      DirectVacancyRate: (DirectVacancySum/InventorySum)*100,
      OverallVacancy: (OverallVacancy/InventorySum)*100,
      VacancyPrevYr: (SumOverallVacancyLastYear/SumInventoryLastYear)*100,
      VacancyPrevQ: (SumOverallVacancyLastQ/SumInventoryLastQ)*100,
      VacancyForecast: vacancyForecast,
      AbsorptionSum: AbsorptionSum,
      AbsorptionForecast: absorptionForecast,
      AbsorptionSumPrevYr: SumAbsorptionLastYear,
      AbsorptionSumPrevQ: SumAbsorptionLastQ,
      ConstructionSum: SumConstruction,
      ConstructionSumPrevYr: SumConstructionLastYear,
      ConstructionSumPrevQ: SumConstructionLastQ,
      ConstructionForecast: constructionForecast,
      NewSupplySum: NewSupplyList,
      NewSupplyPrevYr: SumNewSupplyLastYear,
      NewSupplyPrevQ: SumNewSupplyLastQ,
    }
    return AggregateReportDict
    // console.log("Report Data", AggregateReportDict)
}

export async function FormatMarketStatisticsData(features) {
  const MarketStatsDict = {}
  features.forEach((feature) => {
    if (feature?.attributes?.sum_of_inventory > 0) {
      if (!MarketStatsDict[feature?.attributes?.submarket]) {
        MarketStatsDict[feature?.attributes?.submarket] = [feature?.attributes]
      } else {
        MarketStatsDict[feature?.attributes?.submarket].push(feature?.attributes)
      }
    }
  })
  Object.entries(MarketStatsDict).map(([submarket,features]) => {
    const SubmarketTotalDict = {class: "Total"}
    const TableStatFields = [
      "sum_of_inventory", 
      "sum_of_inventoryprevquarter",
      "sum_of_directvacantspace",
      "sum_of_directavailablespace",
      "sum_of_subletvacantspace", 
      "sum_of_directvacantspace",
      "sum_of_totalvacantspace", 
      "sum_of_totalvacantspaceprevquarter",
      "sum_of_directavailspace_prevq", 
      "sum_of_absorption", 
      "sum_of_absorptionytd",
      "sum_of_underconstruction",
      "sum_of_underconstruction",
      "sum_of_newsupply", 
      "weightedaveragerent"
    ]
    TableStatFields.forEach((field) => {
      // console.log(field)
      const fieldTotal = features.reduce((accumulator, feature) => {
        // console.log(feature)
        return accumulator + feature[field];
      }, 0);
      SubmarketTotalDict[field] = fieldTotal
    })
    const infoFields = [
      "country",
      "year_",
      "quarter",
      "prevquarter",
      "yearofprevquarter",
      "prevyear",
      "subregion",
      "metroarea",
      "marketid",
      "market",
      "submarkettype",
      "submarket_id",
      "submarketgroup",
      "submarket",
    ]
    infoFields.forEach((field) => {
      // console.log(field)
      const fieldValue = features[0][field]
      SubmarketTotalDict[field] = fieldValue
    })
    
    MarketStatsDict[submarket].push(SubmarketTotalDict)
  })
  return MarketStatsDict
  // console.log("setMarketStatsTableData", MarketStatsDict)
}


export async function FormatSubtypeStatisticsData(features, marketType) {
  const subTypeStats = {}
  if (marketType === "Industrial") {
    features.forEach((feature) => {
      if (!subTypeStats[feature.attributes.industrialsubtype]) {
        subTypeStats[feature.attributes.industrialsubtype] = [feature.attributes]
      } else if (subTypeStats[feature.attributes.industrialsubtype]) {
        subTypeStats[feature.attributes.industrialsubtype].push(feature.attributes)
      }
    })
  }
  if (marketType === "Office") {
    features.forEach((feature) => {
      if (!subTypeStats[feature.attributes.class]) {
        subTypeStats[feature.attributes.class] = [feature.attributes]
      } else if (subTypeStats[feature.attributes.class]) {
        subTypeStats[feature.attributes.class].push(feature.attributes)
      }
    })
  }
  const outSubtypeStats = {}
  Object.entries(subTypeStats).forEach(([subtype, subFeatures]) => {
      const subTypeSummaryDict = {}
      const TableStatFields = [
        "sum_of_inventory", 
        "sum_of_directvacantspace",
        "sum_of_directavailablespace",
        "sum_of_subletvacantspace", 
        "sum_of_directvacantspace",
        "sum_of_totalvacantspace", 
        "sum_of_totalvacantspaceprevquarter",
        "sum_of_directavailspace_prevq", 
        "sum_of_absorption", 
        "sum_of_absorptionytd",
        "sum_of_underconstruction",
        "sum_of_newsupply", 
      ]
      TableStatFields.forEach((field) => {
        // console.log(field)
        const fieldTotal = subFeatures.reduce((accumulator, feature) => {
          // console.log(feature)
          return accumulator + feature[field];
        }, 0);
        subTypeSummaryDict[field] = fieldTotal
      })
      const rentalRateSum = subFeatures.reduce((accumulator, feature) => {
        return accumulator + feature?.weightedaveragerent;
      }, 0)
      const rentalRateList = []
      subFeatures.forEach((feature) =>{
        rentalRateList.push(feature?.weightedaveragerent)
      })
      subTypeSummaryDict["weightedaveragerent"] = (rentalRateSum/rentalRateList.length)
      outSubtypeStats[subtype] = subTypeSummaryDict
  })
  // console.log("outSubtypeStats",outSubtypeStats)
  return outSubtypeStats
}

export async function AggregateSubtypeCharts(features, marketType) {
  const subtypeFeatures = {}
  if (marketType === "Industrial") {
    features.forEach((feature) => {
      if (!subtypeFeatures[feature.attributes.industrialsubtype]) {
        subtypeFeatures[feature.attributes.industrialsubtype] = [feature.attributes]
      } else if (subtypeFeatures[feature.attributes.industrialsubtype]) {
        subtypeFeatures[feature.attributes.industrialsubtype].push(feature.attributes)
      }
    })
  }
  if (marketType === "Office") {
    features.forEach((feature) => {
      if (!subtypeFeatures[feature.attributes.class]) {
        subtypeFeatures[feature.attributes.class] = [feature.attributes]
      } else if (subtypeFeatures[feature.attributes.class]) {
        subtypeFeatures[feature.attributes.class].push(feature.attributes)
      }
    })
  }
  // console.log("subtypeFeatures",subtypeFeatures)
  const subtypeChartConfig = {}
  Object.entries(subtypeFeatures).forEach(([subtype, subFeatures]) => {
    const QuarterGroupingDict ={}
    // console.log(subtype)
    // console.log(subFeatures)
    subFeatures.forEach((feature) => {
      // console.log(feature)
      if (!QuarterGroupingDict[`${feature?.year_}${feature?.quarter}`]) {
        QuarterGroupingDict[`${feature?.year_}${feature?.quarter}`] = [feature]
      } else {
        QuarterGroupingDict[`${feature?.year_}${feature?.quarter}`]?.push(feature)
      }
    })
    // console.log("SubType Chart Features",QuarterGroupingDict)
    const ChartDataDict = {}
    Object.values(QuarterGroupingDict).forEach((featureGroup) =>{
      const InventorySum = featureGroup.reduce((accumulator, feature) => {
        return accumulator + feature?.sum_of_inventory;
      }, 0);
      const DirectVacancySum = featureGroup.reduce((accumulator, feature) => {
        return accumulator + feature?.sum_of_directvacantspace;
      }, 0);
      const AbsorptionSum = featureGroup.reduce((accumulator, feature) => {
        return accumulator + feature?.sum_of_absorption;
      }, 0);
      const NewSupplyList = featureGroup.reduce((accumulator, feature) => {
        return accumulator + feature?.sum_of_newsupply;
      }, 0); 
      const rentalRateSum = featureGroup.reduce((accumulator, feature) => {
        return accumulator + feature?.weightedaveragerent;
      }, 0)
      const rentalRateList = []
      featureGroup.forEach((feature) =>{
        rentalRateList.push(feature?.weightedaveragerent)
      })
      const AggregateReportDict = {
        DirectVacancyRate: (DirectVacancySum/InventorySum)*100,
        RentalRate: (rentalRateSum/rentalRateList.length),
        AbsorptionSum: AbsorptionSum,
        NewSupplySum: NewSupplyList,
        Quarter: featureGroup[0]?.quarter,
        Year: featureGroup[0]?.year_
      }
      ChartDataDict[`${featureGroup[0]?.year_}${featureGroup[0]?.quarter}`] = AggregateReportDict
    })
    // console.log("Chart Data",ChartDataDict)
    const ChartInput = {
      Vacancy: [],
      Absorption: [],
      NewSupply: [],
      RentalRate: [],
    }
    const ChartLabels = []
    const keys = Object.keys(ChartDataDict).sort((a, b) => a - b)
    keys.forEach((key) => {
      const values = ChartDataDict[key]
      ChartInput?.Vacancy?.push(values?.DirectVacancyRate)
      ChartInput?.Absorption.push(values?.AbsorptionSum)
      ChartInput?.RentalRate.push(values?.RentalRate)
      ChartInput?.NewSupply.push(values?.NewSupplySum)
      ChartLabels.push(`Q${values?.Quarter} ${values?.Year}`)
    })
    const ChartConfig ={
      data: ChartInput,
      labels: ChartLabels
    }
    subtypeChartConfig[subtype] = ChartConfig
  })
  // console.log("SubtypeChartConfig", subtypeChartConfig)
  return subtypeChartConfig
}


export async function writeReportTableQuery(year, quarter, metroArea, marketId, submarkets, subtypes, marketType, reportTable) {
    const query = new Query();
    query.outFields = ["*"];
    query.returnGeometry = false;
    let queryWhere = `year_ = '${year}' AND quarter = '${quarter}'`
    if (metroArea) {
      queryWhere = queryWhere + ` AND metroarea = '${metroArea}'`
    }
    if (marketId) {
      queryWhere = queryWhere + ` AND marketid in (${marketId})`
    }
    if (submarkets) {
      // console.log(submarkets)
      const quotedAndCommaSeparated = submarkets.map(item => `'${item}'`).join(', ')
      queryWhere = queryWhere + ` AND submarket in (${quotedAndCommaSeparated})`;
    }
    if (subtypes) {
      // console.log(subtypes)
      const quotedAndCommaSeparated = subtypes.map(item => `'${item}'`).join(', ')
      if (marketType === "Office") {
        queryWhere = queryWhere + ` AND class in (${quotedAndCommaSeparated})`;
      } else if (marketType === "Industrial") {
        queryWhere = queryWhere + ` AND industrialsubtype in (${quotedAndCommaSeparated})`;
      }
    }
    // console.log("Report Table QueryWhere", queryWhere)
    query.where = queryWhere
    const results = await reportTable.queryFeatures(query);
    if (results.features.length > 0) {
      const marketStatsData = await FormatMarketStatisticsData(results.features)
      const subTypeStatsData = await FormatSubtypeStatisticsData(results.features, marketType)
      // console.log("subTypeStatsData",subTypeStatsData)
      const AggReportData = await AggregateReportData(results.features)
      // console.log("reportConfig", AggReportData)
      return [subTypeStatsData, marketStatsData, AggReportData]
    } else {
      return [null, null, null]
    }
  }

  async function queryAllFromFeatureLayer(layer, where = "1=1", num = 1000) {
    const results = [];
    let start = 0;
    while (true) {
      const chartQuery = new Query();
      chartQuery.where = where
      chartQuery.outFields = ['*'];
      chartQuery.returnGeometry = false;
      chartQuery.start = start
      chartQuery.num = num
      // console.log("chartQuery", chartQuery)
      const res = await layer.queryFeatures(chartQuery);
      // console.log('res',res)

      const feats = res.features ?? [];
      results.push(...feats);

      if (feats.length < num) break; // no more pages
      start += num;
    }
    return results;
  }

  export async function writeChartQuery(metroArea, marketId, submarkets, subtypes, marketType, reportTable, year) {
    let queryWhere = `year_ >= '${year -2}' AND year_ <= '${year}'`
    if (metroArea) {
      queryWhere = queryWhere + ` AND metroarea = '${metroArea}'`
    }
    if (marketId) {
        queryWhere = queryWhere + ` AND marketid in (${marketId})`
    }
    if (submarkets) {
      const quotedAndCommaSeparated = submarkets.map(item => `'${item}'`).join(', ')
      queryWhere = queryWhere + ` AND submarket in (${quotedAndCommaSeparated})`;
    }
    if (subtypes) {
      // console.log(subtypes)
      const quotedAndCommaSeparated = subtypes.map(item => `'${item}'`).join(', ')
      if (marketType === "Office") {
        queryWhere = queryWhere + ` AND class in (${quotedAndCommaSeparated})`;
      } else if (marketType === "Industrial") {
        queryWhere = queryWhere + ` AND industrialsubtype in (${quotedAndCommaSeparated})`;
      }
    }
    // console.log('queryData', await queryAllFromFeatureLayer(reportTable, queryWhere, 1000))
    const chartResults = await queryAllFromFeatureLayer(reportTable, queryWhere, 1000);
    // console.log("chartResults", chartResults)
    const chartConfig = await AggregateChartData(chartResults)
    const subtypeChartConfig = await AggregateSubtypeCharts(chartResults, marketType)
    return [chartConfig, subtypeChartConfig]
  }