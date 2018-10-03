import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import './pagination.scss';

const LEFT_PAGE = 'LEFT';
const RIGHT_PAGE = 'RIGHT';

/**
 * Helper method for creating a range of numbers.
 * range (1, 5) => [1, 2, 3, 4, 5] 
 */
const range = (start, end, step = 1) => {
    let i = start;
    const range = [];
    while (i <= end) {
        range.push(i);
        i += step;
    }
    return range;
}

const pagination = (props) => {
    const itemsPerPage = props.itemsPerPage ? props.itemsPerPage : 10; 
    const totalPages = Math.ceil(props.totalRecords / props.itemsPerPage);

    const gotoPage = page => {
        const { onPageChanged = f => f } = props;

        const currentPage = Math.max(0, Math.min(page, totalPages));

        const paginationData = {
            currentPage,
            totalPages: totalPages,
            itemsPerPage: itemsPerPage
        };

        onPageChanged(paginationData);
    }

    const handleClick = (page, event) => {
        event.preventDefault();
        gotoPage(page);
    }

    const handleMoveLeft = event => {
        event.preventDefault();
        const offset = props.pageNeighbors * 2 + 1;
        gotoPage(props.currentPage - offset);
    }

    const handleMoveRight = event => {
        event.preventDefault();
        const offset = props.pageNeighbors * 2 + 1;
        gotoPage(props.currentPage + offset);
    }

    const fetchPageNumbers = () => {
        const currentPage = props.currentPage;
        const pageNeighbors = props.pageNeighbors;

        const totalPageBlocks = (pageNeighbors * 2) + 3;
        const totalBlocks = totalPageBlocks + 2;

        if (totalPages > totalBlocks) {
            let pages = [];

            const leftBound = currentPage - pageNeighbors;
            const rightBound = currentPage + pageNeighbors;
            const beforeLastPage = totalPages - 1;

            const startPage = leftBound > 2 ? leftBound : 2;
            const endPage = rightBound < beforeLastPage ? rightBound : beforeLastPage;
            pages = range(startPage, endPage);

            const pagesCount = pages.length;

            const hasLeftSpill = startPage > 2;
            const hasRightSpill = endPage < beforeLastPage;
            const spillOffset = totalPageBlocks - pagesCount - 1;
            const leftSpillControl = LEFT_PAGE;
            const rightSpillControl = RIGHT_PAGE;

            if (hasLeftSpill && !hasRightSpill) {
                // handle (1) < {5 6} [7] {8 9} (10)
                const extraPages = range(startPage - spillOffset, startPage - 1);
                pages = [leftSpillControl, ...extraPages, ...pages];
            } else if (!hasLeftSpill && hasRightSpill) {
                // handle (1) {2 3} [4] {5 6} > (10)
                const extraPages = range(endPage + 1, endPage + spillOffset);
                pages = [...pages, ...extraPages, rightSpillControl];
            } else if (hasLeftSpill && hasRightSpill) {
                // handle (1) < {4 5} [6] {7 8} > (10)
                pages = [leftSpillControl, ...pages, rightSpillControl];
            }

            return [1, ...pages, totalPages];
        }

        return range(1, totalPages);
    }

    if (!props.totalRecords || totalPages === 1) return null;

    const { currentPage } = props;
    const pages = fetchPageNumbers();

    return (
        <Fragment>
            <p>choose page</p>
            <ul className="pagination">
                {pages.map((page, index) => {
                    if (page === LEFT_PAGE) return (
                            <li key={index} className="page-item">
                                <a 
                                    className="page-link" 
                                    href="#" 
                                    onClick={handleMoveLeft}>&laquo;</a>
                            </li>
                    );
                    if (page === RIGHT_PAGE) return (
                        <li key={index} className="page-item">
                            <a
                                className="page-link"
                                href="#"
                                onClick={handleMoveRight}>&raquo;</a>
                        </li>
                    );
                    return (
                        <li key={index} className={`page-item ${
                                currentPage === page ? "active": ""
                            }`}>
                            <a 
                                className="page-link"
                                href="#"
                                onClick={e => handleClick(page, e)}>{page}</a>
                        </li>
                    );
                })}
            </ul>
        </Fragment>
    );
};

export default pagination;

pagination.propTypes = {
    totalRecords: PropTypes.number.isRequired,
    itemsPerPage: PropTypes.number,
    pageNeighbors: PropTypes.number,
    onPageChanged: PropTypes.func
};