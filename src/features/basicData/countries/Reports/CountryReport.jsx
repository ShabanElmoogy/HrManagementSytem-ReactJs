import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import ReportViewer from "@/shared/components/reports/ReportViewer";
import { TextFieldWithClear, MySelectMultiple, MySelect } from "@/shared/components/common/formControls";
import { reportApiService } from "@/shared/services";
import { useTheme } from "@mui/material";

const CountryReport = () => {
  const { t } = useTranslation();

  const [reportsInfo, setReportsInfo] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const theme = useTheme();

  const lang = theme.direction === "rtl" ? "ar" : "en";

  const defaultReportParams = {
    LogoName: "Logo1.jpg",
    ExportFilename: "Countries",
  };

  const reportParams = selectedReport
    ? {
        ...defaultReportParams,
        ReportPath: selectedReport.ReportPath,
        ReportFileName: selectedReport.Id,
      }
    : {
        ...defaultReportParams,
        ReportPath: "Reports/Countries",
        ReportFileName: "Countries",
      };

  useEffect(() => {
    fetchCountriesReports();
  }, []);

  const fetchCountriesReports = async () => {
    try {
      const response = await reportApiService.post("report/info", {
        subFolderPath: "Countries",
        reportCategory: "Countries",
      });

      const data = await response.json();

      // Move "Countries" to the top using sort
      const sorted = data.sort((a, b) =>
        a.Id === "Countries" ? -1 : b.Id === "Countries" ? 1 : 0
      );

      setReportsInfo(sorted);
      setSelectedReport((prev) => prev ?? sorted[0]);

      console.log("Reports Info:", sorted);
    } catch (error) {
      console.error("Failed to fetch country reports:", error);
    }
  };

  const handleReportChange = (e) => {
    const selected = reportsInfo.find((r) => r.Id === (e?.target?.value ?? e));
    setSelectedReport(selected ?? null);
    console.log("reportName",selected)
  };

  return (
    <ReportViewer reportParams={reportParams}>
      {(updateSearchParams, currentParams) => (
        <>
          <TextFieldWithClear
            searchText={currentParams.CountryAr || ""}
            label={t("countries.arabicName")}
            handleSearch={(e) =>
              updateSearchParams({ CountryAr: e.target.value })
            }
            handleClearSearch={() => updateSearchParams({ CountryAr: null })}
          />

          <TextFieldWithClear
            searchText={currentParams.CountryEn || ""}
            label={t("countries.englishName")}
            handleSearch={(e) =>
              updateSearchParams({ CountryEn: e.target.value })
            }
            handleClearSearch={() => updateSearchParams({ CountryEn: null })}
          />

          <MySelect
            dataSource={reportsInfo}
            selectedItem={selectedReport?.Id || null}
            handleSelectionChange={handleReportChange}
            label={t("reports.reportForms")}
            displayValue="Id"
            displayMember={lang === "ar" ? "Title" : "Subject"}
            all={false}
            showClearButton={true}
          />
        </>
      )}
    </ReportViewer>
  );
};

export default CountryReport;
