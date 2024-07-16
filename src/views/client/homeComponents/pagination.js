import React from 'react';
import "../homeComponents/pagination.css"

const Pagination = ({ postsPerPage, totalPosts, paginate, currentPage }) => {
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const getVisiblePageNumbers = () => {
    const visiblePages = 3; 
    let start, end;

    if (totalPages <= visiblePages) {
      
      start = 1;
      end = totalPages;
    } else if (currentPage <= Math.floor(visiblePages / 2)) {
      
      start = 1;
      end = visiblePages;
    } else if (currentPage + Math.floor(visiblePages / 2) >= totalPages) {
      
      start = totalPages - visiblePages + 1;
      end = totalPages;
    } else {
      
      start = currentPage - Math.floor(visiblePages / 2);
      end = currentPage + Math.floor(visiblePages / 2);
    }

    const pageNumbers = [];
    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const visiblePageNumbers = getVisiblePageNumbers();

  return (
    <nav aria-label="Page navigation example" style={{}} >
      <ul className="pagination" style={{marginTop:"10px",marginBottom:"-40px",marginLeft:"60px"}}>
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`} style={{}}>
          <button className="page-link" style={{marginLeft:"120px"}} onClick={() => currentPage > 1 && paginate(currentPage - 1)} aria-label="Previous">
            <span aria-hidden="true" style={{color:"grey"}}>&laquo;</span>
            <span className="sr-only" style={{color:"grey"}}>Previous</span>
          </button>
        </li>
        {visiblePageNumbers.map(number => (
          <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`} >
            <button className="page-link" onClick={() => paginate(number)} style={{ backgroundColor: number === currentPage ? 'gray' : 'transparent',color: number === currentPage ? 'white' : 'grey',borderColor:"#495057" }}>
              {number}
            </button>
          </li>
        ))}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button className="page-link"  onClick={() => currentPage < totalPages && paginate(currentPage + 1)} aria-label="Next">
            
            <span className="sr-only" style={{color:"grey"}}>Next</span>
            <span aria-hidden="true" style={{color:"grey"}}>&raquo;</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
