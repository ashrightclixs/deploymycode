import {
  Document,
  Page,
  Text,
  View,
  Font,
  StyleSheet,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import logo from "../../assets/logo.jpg";

const BORDER_COLOR = "#3C3D3A";
const BORDER_STYLE = "solid";
const COL1_WIDTH = 100 / 5;
const COLS_WIDTH = 10;
const COLI_WIDTH = 50;
const COLR_WIDTH = 15;
const COLN_WIDTH = COL1_WIDTH;

// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    color: "#212529",
    margin: 10,
    padding: 25,
  },
  image: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
  },
  section: {
    textAlign: "left",
  },
  FlexSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingBottom: 20,
  },
  viewer: {
    width: "82vw", //the pdf viewer will take up all of the width and height
    height: window.innerHeight,
  },
  headingFont: {
    fontSize: "28px",
    fontWeight: "medium",
  },
  ParagraphFont: {
    fontSize: "10px",
    fontWeight: "light",
  },
  textRight: {
    textAlign: "right",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginTop: 20,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableColSHeader: {
    width: COLS_WIDTH + "%",
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderBottomColor: "#3C3D3A",
    textAlign: "right",
    borderWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 0,
    backgroundColor: "#3C3D3A",
    color: "#fff",
  },
  tableColIHeader: {
    width: COLI_WIDTH + "%",
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    textAlign: "left",
    borderBottomColor: "#3C3D3A",
    borderWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 0,
    backgroundColor: "#3C3D3A",
    color: "#fff",
  },
  tableColRHeader: {
    width: COLR_WIDTH + "%",
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    textAlign: "right",
    borderBottomColor: "#3C3D3A",
    borderWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 0,
    backgroundColor: "#3C3D3A",
    color: "#fff",
  },
  tableColS: {
    width: COLS_WIDTH + "%",
    borderStyle: BORDER_STYLE,
    borderColor: "#bfbfbf",
    textAlign: "right",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  tableColI: {
    width: COLI_WIDTH + "%",
    borderStyle: BORDER_STYLE,
    borderColor: "#bfbfbf",
    textAlign: "left",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  tableColR: {
    width: COLR_WIDTH + "%",
    borderStyle: BORDER_STYLE,
    borderColor: "#bfbfbf",
    textAlign: "right",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  tableCol1: {
    width: COL1_WIDTH + "%",
    borderStyle: BORDER_STYLE,
    borderColor: "#bfbfbf",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  tableCol: {
    width: COLN_WIDTH + "%",
    borderStyle: BORDER_STYLE,
    borderColor: "#bfbfbf",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  tableColGLeft: {
    width: 30 + "%",
    borderStyle: BORDER_STYLE,
    borderColor: "#bfbfbf",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  tableColGRight: {
    width: 30 + "%",
    borderStyle: BORDER_STYLE,
    borderColor: "#bfbfbf",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  tableColLeft: {
    width: 20 + "%",
    borderStyle: BORDER_STYLE,
    borderColor: "#bfbfbf",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  tableColRight: {
    width: 20 + "%",
    borderStyle: BORDER_STYLE,
    borderColor: "#bfbfbf",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  tableRowBottom: {
    margin: "auto",
    flexDirection: "row",
    borderStyle: BORDER_STYLE,
    borderColor: "#bfbfbf",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 1,
    borderRightWidth: 0,
  },
  tableCellHeader: {
    marginVertical: 10,
    marginHorizontal: 5,
    fontSize: 10,
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
    padding: 3,
  },
});

Font.register({
  family: "Lato",
  src: `https://fonts.gstatic.com/s/lato/v16/S6uyw4BMUTPHjx4wWw.ttf`,
});

Font.register({
  family: "Lato Italic",
  src: `https://fonts.gstatic.com/s/lato/v16/S6u8w4BMUTPHjxsAXC-v.ttf`,
});

Font.register({
  family: "Lato Bold",
  src: `https://fonts.gstatic.com/s/lato/v16/S6u9w4BMUTPHh6UVSwiPHA.ttf`,
});

// Create Document Component
function WarehousePdf({ user, ToggleAlert }) {
  // delivery_challan;
  const [company, setCompany] = useState([]);
  const [data, setData] = useState([]);
  const params = useParams();

  const fetchData = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/user/get_company?id=${user._id}`)
      .then((res) => {
        setCompany(res.data.data);
        if (res.data.data.length === 0) {
          ToggleAlert(
            "Warning",
            "Please add company profile first in profile section"
          );
        }
      })
      .catch((e) => console.log(e));
      await axios
        .get(
          `${process.env.REACT_APP_API_URL}/inventory/stock_inventory/Stockfind?id=${params.id}`
        )
        .then((response) => {
          setData(response.data);
        });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return data.length !== 0 && company.length !== 0 ? (
    <PDFViewer style={styles.viewer}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.FlexSection}>
            <Image
              src={process.env.REACT_APP_IMAGE_URL + company[0].profile}
              style={styles.image}
            />
            <View>
              <Text style={[styles.headingFont, { fontFamily: "Lato Bold" }]}>
                Warehouse Inventory
              </Text>
              <Text style={[styles.ParagraphFont, { marginLeft: "auto" }]}>
                Warehouse ID# SW-{data[0].WareHouse.stock_warehouse}
              </Text>
            </View>
          </View>
          <View style={[{ flexDirection: "column", marginTop: 15 }]}>
            <Text style={{ fontSize: "10px", fontFamily: "Lato Bold" }}>
              {company[0].name}
            </Text>
            <Text style={{ fontSize: "10px", fontFamily: "Lato" }}>
              {company[0].address}
            </Text>
            <Text
              style={{ fontSize: "10px", fontFamily: "Lato", marginTop: 20 }}
            >
              Phone: {company[0].contact}
            </Text>
            <Text
              style={{ fontSize: "10px", fontFamily: "Lato", marginTop: 20 }}
            >
              Warehouse Name: {data[0].WareHouse.stock_warehouse_name}
            </Text>
          </View>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableColSHeader}>
                <Text style={styles.tableCellHeader}>SI - ID</Text>
              </View>
              <View style={styles.tableColIHeader}>
                <Text style={styles.tableCellHeader}>Product</Text>
              </View>
              <View style={styles.tableColSHeader}>
                <Text style={styles.tableCellHeader}>Qty</Text>
              </View>
              <View style={styles.tableColRHeader}>
                <Text style={styles.tableCellHeader}>Rate</Text>
              </View>
              <View style={styles.tableColRHeader}>
                <Text style={styles.tableCellHeader}>Gross Amount</Text>
              </View>
            </View>

            {data.map((value, index) => (
              <View style={styles.tableRow}>
                {/* <View style={styles.tableCol1}>
                  <Text style={styles.tableCell}>{index + 1}</Text>
                </View> */}
                <View style={styles.tableColS}>
                  <Text style={styles.tableCell}>
                    SI-{value.stock_inventory}
                  </Text>
                </View>
                <View style={styles.tableColI}>
                  <Text style={styles.tableCell}>
                    {value.stock_inventory_name}
                  </Text>
                </View>
                <View style={styles.tableColS}>
                  <Text style={styles.tableCell}>{value.quantity}</Text>
                </View>
                <View style={styles.tableColR}>
                  <Text
                    style={styles.tableCell}
                  >{`${value.price.toLocaleString()}.00`}</Text>
                </View>
                <View style={styles.tableColR}>
                  <Text style={styles.tableCell}>{`${(
                    value.price * value.quantity
                  ).toLocaleString()}.00`}</Text>
                </View>
              </View>
            ))}
          </View>
          <View
            style={[
              {
                display: "flex",
                position: "absolute",
                width: "100%",
                bottom: 25,
                paddingTop: 10,
                borderTopWidth: 1,
                borderColor: "#f6f6f6",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
              },
            ]}
          >
            <View>
              <Text style={{ fontSize: "10px", fontFamily: "Lato Bold" }}>
                Bank/Franchise Name
              </Text>
              <Text style={{ fontSize: "10px", fontFamily: "Lato" }}>
                {user.bank}
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: "10px", fontFamily: "Lato Bold" }}>
                Account Title
              </Text>
              <Text style={{ fontSize: "10px", fontFamily: "Lato" }}>
                {user.account_title}
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: "10px", fontFamily: "Lato Bold" }}>
                Account No.
              </Text>
              <Text style={{ fontSize: "10px", fontFamily: "Lato" }}>
                {user.account_number}
              </Text>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  ) : (
    <div style={{ textAlign: "center", marginTop: "10rem" }}>
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  );
}
export default WarehousePdf;
