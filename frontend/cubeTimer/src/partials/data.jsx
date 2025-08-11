import "bootstrap/dist/css/bootstrap.min.css";
import dataStyles from "../styles/dataStyles.module.css";
import axios from "axios";
import { API_LINK } from "../utl/constants";
import { SolveChart } from "./chart";
import { Totals } from "./totals";
import { data, useOutletContext } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { Container, Row, Col, Table, Pagination } from "react-bootstrap";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

function Data() {
  const { newSolve, sessionReady } = useOutletContext();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentSolves, setRecentSolves] = useState([]);

  let [isOpen, setIsOpen] = useState(false);

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.max(
    1,
    Math.ceil((recentSolves?.length || 0) / pageSize)
  );
  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return recentSolves.slice(start, start + pageSize);
  }, [recentSolves, page]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  async function getSolvesForTable() {
    try {
      setLoading(true);
      const res = await axios.get(`${API_LINK}/dataRouter/getHistory`, {
        params: { numSolves: "all" },
        withCredentials: true,
      });
      setRecentSolves(res.data.recentSolves || []);
    } catch (err) {
      console.log(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  async function handlePlusTwoClick(id) {
    try {
      console.log(recentSolves);
      await axios.put(`${API_LINK}/dataRouter/putPlusTwo/${id}`, null, {
        withCredentials: true,
      });
      setRecentSolves((prev) =>
        prev.map((s) => (s.id === id ? { ...s, plusTwo: !s.plusTwo } : s))
      );
    } catch(err) {
      console.log(err);
      setError(true);
    }
  }

  async function handleDnfClick(id) {
    try {
      await axios.put(`${API_LINK}/dataRouter/putDnf/${id}`, null, {
        withCredentials: true,
      });
      setRecentSolves((prev) =>
        prev.map((s) => (s.id === id ? { ...s, dnf: !s.dnf } : s))
      );
    } catch(err) {
      console.error(err);
      setError(true);
    }
  }

  async function handleDelClick(id) {
    try {
      await axios.delete(`${API_LINK}/dataRouter/deleteTime/${id}`, {
        withCredentials: true,
      });
      setRecentSolves((prev) => prev.filter((s) => s.id !== id));
    } catch {
      setError(true);
    }
  }

  async function handleDelAllSolves() {
    try {
      setLoading(true);
      await axios.delete(`${API_LINK}/dataRouter/deleteSessionSolves`);
      setIsOpen(false);
      setRecentSolves([]);
    } catch (error) {
      setError(true);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getSolvesForTable();
    setPage(1);
  }, [newSolve, sessionReady]);

  const goTo = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  return (
    <Container fluid className={dataStyles.dataContainer}>
      {error && <div className={dataStyles.errorText}>An error occurred</div>}
      {loading && <div className={dataStyles.loadingText}>Loading...</div>}

      {!loading && !error && recentSolves && (
        <Row className={dataStyles.gridWrap}>
          <Col lg={7} className={dataStyles.leftPane}>
            <div className={dataStyles.headerBar}>
              <strong className="text-white">Previous solves</strong>
            </div>

            <Table
              striped
              bordered
              hover
              responsive
              className={dataStyles.tableCard}
            >
              <thead>
                <tr>
                  <th>#</th>
                  <th>Time (s)</th>
                  <th>Scramble</th>
                  <th>DNF</th>
                  <th>+2</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((solve, idx) => (
                  <tr key={solve.id}>
                    <td>{(page - 1) * pageSize + idx + 1}</td>
                    <td>{solve.time.toFixed(2)}</td>
                    <td className={dataStyles.scramble}>{solve.scramble}</td>
                    <td>
                      <span
                        className={`${dataStyles.clickableCell} ${
                          solve.dnf ? dataStyles.trueValue : ""
                        }`}
                        onClick={() => handleDnfClick(solve.id)}
                        title="Toggle DNF"
                      />
                    </td>
                    <td>
                      <span
                        className={`${dataStyles.clickableCell} ${
                          solve.plusTwo ? dataStyles.trueValue : ""
                        }`}
                        onClick={() => handlePlusTwoClick(solve.id)}
                        title="Toggle +2"
                      />
                    </td>
                    <td
                      className={dataStyles.delSolve}
                      onClick={() => handleDelClick(solve.id)}
                      title="Delete solve"
                    >
                      X
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <div className={dataStyles.paginationRow}>
              <Pagination className="mb-0">
                <Pagination.First
                  disabled={page === 1}
                  onClick={() => goTo(1)}
                />
                <Pagination.Prev
                  disabled={page === 1}
                  onClick={() => goTo(page - 1)}
                />
                <Pagination.Item active>{page}</Pagination.Item>
                <Pagination.Next
                  disabled={page === totalPages}
                  onClick={() => goTo(page + 1)}
                />
                <Pagination.Last
                  disabled={page === totalPages}
                  onClick={() => goTo(totalPages)}
                />
              </Pagination>
              <small className={dataStyles.pageMeta}>
                Page {page} of {totalPages}
              </small>
            </div>
          </Col>

          <Col lg={5} className={dataStyles.rightPane}>
            <div className={dataStyles.chartSide}>
              <div className={dataStyles.card}>
                <Totals solves={recentSolves} />
              </div>
              <div className={dataStyles.card}>
                <SolveChart solves={recentSolves} />
              </div>
            </div>
            <div
              className={dataStyles.deleteAllSolves}
              onClick={() => setIsOpen(true)}
            >
              Delete All Solves
            </div>
            <Dialog
              open={isOpen}
              onClose={() => setIsOpen(false)}
              className={dataStyles.dialogRoot}
            >
              <div className={dataStyles.dialogOverlay} />
              <div className={dataStyles.dialogContainer}>
                <DialogPanel className={dataStyles.dialogPanel}>
                  <DialogTitle className={dataStyles.dialogTitle}>
                    Delete all solves?
                  </DialogTitle>

                  <Description className={dataStyles.dialogDescription}>
                    This will permanently delete all of your solves.
                  </Description>

                  <p className={dataStyles.dialogBody}>
                    Are you sure you want to delete all solves?
                  </p>

                  <div className={dataStyles.dialogActions}>
                    <button
                      type="button"
                      className={dataStyles.btnSecondary}
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className={dataStyles.btnDanger}
                      onClick={() => handleDelAllSolves()}
                    >
                      Confirm
                    </button>
                  </div>
                </DialogPanel>
              </div>
            </Dialog>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default Data;
