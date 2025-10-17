import { Box } from "@mui/material";
import Section from "./components/Section";
import TrendsRow from "./rows/02TrendsRow";

const AllTrendsPage = () => {
  return (
    <Box>
      <Section title="All People Trends" subtitle="Extended trends and distribution insights">
        <TrendsRow showAll />
      </Section>
    </Box>
  );
};

export default AllTrendsPage;
