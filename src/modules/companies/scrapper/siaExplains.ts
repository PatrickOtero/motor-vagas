import { By } from "selenium-webdriver";
import logger from "../../../shared/logger/logger";
import { createDriver } from "../../driver";
import { ISaveCompanyDTO } from "../dtos/SaveCompanies.dto";

export const siaExplains = async () => {
  const driver = await createDriver();

  logger.info("Starting company scrapping");

  try {
    const url = "https://siaexplains.github.io/visa-sponsorship-companies/";
    logger.info(`Navigating to ${url}`);
    await driver.get(url);

    logger.info("Waiting for the page 3 seconds to load");
    await driver.sleep(3000);

    logger.info("Getting company elements");
    const parentElement = await driver.findElements(
      By.className("odd:bg-white")
    );

    const companies: ISaveCompanyDTO[] = [];

    for (const element of parentElement) {
      logger.info("Getting company name");
      const childElement = await element.findElement(By.css("td:first-child"));
      const name = await childElement.getText();

      const company = {
        name: name.toLocaleLowerCase(),
      };

      logger.info(`Company ${name} added to the list`);
      companies.push(company);
    }

    logger.info("All companies added to the list");

    return companies;
  } catch (err) {
    logger.error("An error occurred while scrapping companies", err);
  } finally {
    await driver.quit();
  }
};
