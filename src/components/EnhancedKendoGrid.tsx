import React, { useState } from 'react';
import { Grid, GridColumn, GridToolbar } from '@progress/kendo-react-grid';
import { ExcelExport } from '@progress/kendo-react-excel-export';
import { PDFExport } from '@progress/kendo-react-pdf';
import { Button } from '@progress/kendo-react-buttons';
import { Tooltip } from '@progress/kendo-react-tooltip';
import { process } from '@progress/kendo-data-query';
import { Download, FileText, Edit, Trash2 } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Todo' | 'InProgress' | 'Done';
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface EnhancedKendoGridProps {
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  viewTitle?: string;
}

export const EnhancedKendoGrid: React.FC<EnhancedKendoGridProps> = ({
  tasks,
  onUpdateTask,
  onDeleteTask,
  onEditTask,
  viewTitle = 'Tasks'
}) => {
  const [dataState, setDataState] = useState({
    skip: 0,
    take: 10,
    sort: [{ field: 'deadline', dir: 'asc' as const }],
    filter: { logic: 'and' as const, filters: [] }
  });

  const excelExportRef = React.useRef<ExcelExport>(null);
  const pdfExportRef = React.useRef<PDFExport>(null);

  const processedData = process(tasks, dataState);

  const PriorityCell = (props: any) => {
    const colors = {
      High: '#d1453b',
      Medium: '#eb8909', 
      Low: '#246fe0'
    };
    
    return (
      <td>
        <Tooltip anchorElement="target" position="top">
          <div
            title={`${props.dataItem.priority} Priority Task`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.25rem 0.75rem',
              backgroundColor: `${colors[props.dataItem.priority]}15`,
              color: colors[props.dataItem.priority],
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: colors[props.dataItem.priority]
            }} />
            {props.dataItem.priority}
          </div>
        </Tooltip>
      </td>
    );
  };

  const StatusCell = (props: any) => {
    const statusConfig = {
      Todo: { color: '#6b7280', icon: '📝', label: 'To Do' },
      InProgress: { color: '#3b82f6', icon: '⚡', label: 'In Progress' },
      Done: { color: '#10b981', icon: '✅', label: 'Completed' }
    };
    
    const config = statusConfig[props.dataItem.status];
    
    return (
      <td>
        <Tooltip anchorElement="target" position="top">
          <div
            title={`Task Status: ${config.label}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.25rem 0.75rem',
              backgroundColor: `${config.color}15`,
              color: config.color,
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: '500'
            }}
          >
            <span>{config.icon}</span>
            {config.label}
          </div>
        </Tooltip>
      </td>
    );
  };

  const ActionsCell = (props: any) => (
    <td>
      <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center' }}>
        <Tooltip anchorElement="target" position="top">
          <Button
            size="small"
            fillMode="flat"
            themeColor="primary"
            title="Edit Task"
            onClick={() => onEditTask(props.dataItem)}
          >
            <Edit size={14} />
          </Button>
        </Tooltip>
        <Tooltip anchorElement="target" position="top">
          <Button
            size="small"
            fillMode="flat"
            themeColor="error"
            title="Delete Task"
            onClick={() => onDeleteTask(props.dataItem.id)}
          >
            <Trash2 size={14} />
          </Button>
        </Tooltip>
      </div>
    </td>
  );

  const exportToExcel = () => {
    if (excelExportRef.current) {
      excelExportRef.current.save();
    }
  };

  const exportToPDF = () => {
    if (pdfExportRef.current) {
      pdfExportRef.current.save();
    }
  };

  return (
    <div style={{ padding: '1.5rem' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, marginBottom: '0.5rem' }}>
            {viewTitle}
          </h2>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
            Advanced task management with export capabilities
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Tooltip anchorElement="target" position="bottom">
            <Button
              fillMode="outline"
              onClick={exportToExcel}
              title="Export to Excel"
            >
              <Download size={16} style={{ marginRight: '0.5rem' }} />
              Excel
            </Button>
          </Tooltip>
          <Tooltip anchorElement="target" position="bottom">
            <Button
              fillMode="outline"
              onClick={exportToPDF}
              title="Export to PDF"
            >
              <FileText size={16} style={{ marginRight: '0.5rem' }} />
              PDF
            </Button>
          </Tooltip>
        </div>
      </div>

      <Grid
        data={processedData}
        {...dataState}
        onDataStateChange={(e) => setDataState(e.dataState)}
        sortable
        filterable
        groupable
        reorderable
        resizable
        pageable={{
          buttonCount: 5,
          pageSizes: [5, 10, 20, 50],
          info: true
        }}
        style={{
          height: '600px',
          border: '1px solid var(--border-color)',
          borderRadius: '8px'
        }}
      >
        <GridToolbar>
          <div style={{ 
            padding: '0.75rem',
            backgroundColor: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-color)',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)'
          }}>
            💡 <strong>Pro Tips:</strong> Click headers to sort • Drag columns to reorder • Use filters to find tasks
          </div>
        </GridToolbar>
        
        <GridColumn
          field="title"
          title="📋 Task"
          width="300px"
          cell={(props) => (
            <td style={{ padding: '1rem 0.75rem' }}>
              <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                {props.dataItem.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {props.dataItem.description}
              </div>
            </td>
          )}
        />
        
        <GridColumn
          field="priority"
          title="🎯 Priority"
          width="130px"
          cell={PriorityCell}
        />
        
        <GridColumn
          field="status"
          title="📈 Status"
          width="140px"
          cell={StatusCell}
        />
        
        <GridColumn
          field="deadline"
          title="📅 Deadline"
          width="120px"
          format="{0:dd/MM/yyyy}"
        />
        
        <GridColumn
          title="⚙️ Actions"
          width="120px"
          cell={ActionsCell}
          sortable={false}
          filterable={false}
        />
      </Grid>

      <ExcelExport
        ref={excelExportRef}
        data={tasks}
        fileName={`tasks-${new Date().toISOString().split('T')[0]}.xlsx`}
      >
        <Grid data={tasks}>
          <GridColumn field="title" title="Task" />
          <GridColumn field="description" title="Description" />
          <GridColumn field="priority" title="Priority" />
          <GridColumn field="status" title="Status" />
          <GridColumn field="deadline" title="Deadline" format="{0:dd/MM/yyyy}" />
        </Grid>
      </ExcelExport>

      <PDFExport
        ref={pdfExportRef}
        fileName={`tasks-${new Date().toISOString().split('T')[0]}.pdf`}
        paperSize="A4"
      >
        <Grid data={tasks}>
          <GridColumn field="title" title="Task" />
          <GridColumn field="priority" title="Priority" />
          <GridColumn field="status" title="Status" />
          <GridColumn field="deadline" title="Deadline" format="{0:dd/MM/yyyy}" />
        </Grid>
      </PDFExport>
    </div>
  );
};