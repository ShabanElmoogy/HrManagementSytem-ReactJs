import { Box, Typography } from "@mui/material";
import Section from "./components/Section";
import KpiRow from "./rows/01KpiRow";

const AllKpisPage = () => {
  return (
    <Box>
      <Section title="All KPIs" subtitle="Key performance indicators overview">
        <KpiRow showAll />
      </Section>
    </Box>
  );
};

export default AllKpisPage;
