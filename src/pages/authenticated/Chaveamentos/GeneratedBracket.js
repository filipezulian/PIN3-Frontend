import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Bracket } from 'react-brackets';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const GeneratedBracket = () => {
    const location = useLocation();
    const { rounds, name } = location.state || { rounds: [], name: '' };
    const bracketRef = useRef();
    console.log(rounds)
    
    const downloadPDF = async () => {
        if (!bracketRef.current) return;

        try {
            const canvas = await html2canvas(bracketRef.current, { scale: 3 });
            const imageData = canvas.toDataURL('image/png');

            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [canvas.width, canvas.height],
            });

            pdf.setFontSize(100);
            pdf.setFont('helvetica', 'bold');
            pdf.text(name, pdf.internal.pageSize.width / 2, 50, { align: 'center' });
            pdf.addImage(imageData, 'PNG', 10, 120, pdf.internal.pageSize.width - 20, pdf.internal.pageSize.height - 150);
            pdf.save(`${name || 'bracket'}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    if (!rounds.length) {
        return <p>Nenhum chaveamento encontrado!</p>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>{name}</h1>
            <div ref={bracketRef} style={styles.bracketContainer}>
                <Bracket rounds={rounds} />
            </div>
            <button
                onClick={downloadPDF}
                style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                }}
            >
                Download PDF
            </button>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        textAlign: 'center',
    },
    title: {
        textAlign: 'center',
        fontSize: '3rem',
        fontWeight: 'bold',
        marginBottom: '40px',
    },
    bracketContainer: {
        display: 'flex',
        justifyContent: 'center',
        overflow: 'hidden',
        marginBottom: '20px',
    },
};

export default GeneratedBracket;
