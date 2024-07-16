import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import axios from 'axios';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  IconButton,
} from '@mui/material';

const ListTags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/tags/getAll'); // Replace with your API endpoint
      setTags(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tags:', error);
      setLoading(false);
    }
  };
  return (
    <PageContainer title="Liste of Tags" description="Liste of Tags">
      <DashboardCard title="Liste of Tags">
        <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
          <Table aria-label="simple table" sx={{ whiteSpace: 'nowrap', mt: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Tag_ID
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Tag_TITLE
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Tag_DESC
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {tag.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: '15px', fontWeight: '500' }}>{tag.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {tag.description}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </DashboardCard>
    </PageContainer>
  );
};

export default ListTags;
